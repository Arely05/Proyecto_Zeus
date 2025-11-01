import client from '../config/paypal.js';
import paypal from '@paypal/checkout-server-sdk';
import db from '../config/db.js'; 

const createOrderInDB = async (paypalCaptureData, cartItems, userId) => {
    
     //obtenemos la info del pago
    const purchaseUnit = (paypalCaptureData.purchase_units && paypalCaptureData.purchase_units.length > 0)
                         ? paypalCaptureData.purchase_units[0]
                         : null;
                         
    const capture = (purchaseUnit && purchaseUnit.payments && purchaseUnit.payments.captures && purchaseUnit.payments.captures.length > 0)
                    ? purchaseUnit.payments.captures[0]
                    : null;

    //validamos que si existan los datos necesarios                
    if (!capture || !capture.amount || !purchaseUnit || !cartItems) {
        console.error("Error: Estructura de datos de PayPal inesperada. No se pudo obtener el total.");
        throw new Error("Datos de PayPal insuficientes para registrar el pedido.");
    }

   //obtenemos el total pagado
    const paypalTotalString = capture.amount.value;
    const total = parseFloat(paypalTotalString); 
    try {
        //aqui se crea la fila en la tabla pedido
        const orderSql = "INSERT INTO pedido (id_usuario, total, estado, fecha) VALUES (?, ?, 'COMPLETADO', NOW())";

        //guardamos el id del pedido para despues usarlo
        const [orderResult] = await db.query(orderSql, [
            userId, 
            total 
        ]);
        const orderId = orderResult.insertId;

        //lo mismo que arriba pero con la tabla detalle de pedido
        const detailsPromises = cartItems.map(cartItem => { //osea por cada producto en el carrito se va guardando en esta tabla
            const detailSql = "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unidad) VALUES (?, ?, ?, ?)";
            
            const unitPrice = parseFloat(cartItem.product?.precio || 0);

            return db.query(detailSql, [
                orderId, 
                cartItem.product.id,
                cartItem.quantity,
                unitPrice
            ]);
        });
        
        await Promise.all(detailsPromises);
        
        //de este lado actualizamos el stock de los pedidos
        const stockUpdatePromises = cartItems.map(cartItem => {
            const updateSql = "UPDATE producto SET stock = stock - ? WHERE id = ?";
            
            const cantidadDescontar = cartItem.quantity;
            const productoId = cartItem.product.id;

            return db.query(updateSql, [cantidadDescontar, productoId]);
        });
        
        await Promise.all(stockUpdatePromises);

        //devolvemos o retornamos el id del pedido para saber q pedido se creo
        return orderId;

    } catch (err) {
        console.error('ERROR CRÍTICO al guardar pedido o actualizar stock:', err.message || err);
        throw new Error('Falló el registro en la base de datos o la actualización de stock.');
    }
};

//se empieza a ejecutar cuando el usuario inicia el pago
export const createOrder = async (req, res) => {
    
    const { items, userId } = req.body;
     
    //nos aseguramos q este todo bien en el carrito
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "El carrito de compras está vacío." });
    }

    //aqui calculamos el total de la compra
    const totalValue = items.reduce((sum, i) => {
        const price = parseFloat(i.product?.precio || 0); 
        return sum + (price * (i.quantity || 1));
    }, 0).toFixed(2);

    //arreglo de productos para paypal
    const paypalItems = items.map(cartItem => {
        const rawPrice = cartItem.product?.precio || 0; 
        const unitPrice = parseFloat(rawPrice); 
        const formattedValue = isNaN(unitPrice) ? "0.00" : unitPrice.toFixed(2); 
        
        return {
            name: cartItem.product?.nombre || 'Producto sin nombre',
            description: cartItem.product?.descripcion || 'Sin descripción',
            unit_amount: {
                currency_code: "MXN",
                value: formattedValue
            },
            quantity: cartItem.quantity.toString(), 
            sku: cartItem.product?.id?.toString() || ''
        };
    });

    //tenemos la solicitud a paypal
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE", //cobramos el pago despues de q se apruebe
        application_context: {
            brand_name: "Zeus Vet",
            locale: "es-MX",
            user_action: "PAY_NOW",
            return_url: "http://localhost:4200/checkout", //son nuestros url para redirigir al usuario
            cancel_url: "http://localhost:4200/checkout" 
        },
        purchase_units: [
            {
                amount: {
                    currency_code: "MXN", //todo en pesitos mexicanos
                    value: totalValue, 
                    breakdown: {
                        item_total: { currency_code: "MXN", value: totalValue }
                    }
                },
                items: paypalItems, 
                custom_id: userId.toString()
            }
        ]
    });

    try {
        const order = await client.execute(request);
        return res.status(201).json({ 
            id: order.result.id, 
            status: order.result.status,
            cartItems: items 
        });
    } catch (error) {
        console.error("Error al crear orden de PayPal:", error);
        const errorDetails = error.result?.details?.[0]?.description || error.message;
        return res.status(500).json({ 
            error: "No se pudo crear la orden de PayPal.",
            details: errorDetails
        });
    }
};


export const captureOrder = async (req, res) => {
    const { orderID, userId, cartItems } = req.body; 

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await client.execute(request);
        const orderData = capture.result;

        if (orderData.status === "COMPLETED") {
            
            const newOrderId = await createOrderInDB(orderData, cartItems, userId); 

            res.json({ 
                status: "COMPLETED", 
                orderID: orderID,
                dbOrderId: newOrderId,
                message: "Pago completado y orden registrada."
            });
        } else {
            res.status(400).json({ status: orderData.status, message: "El pago no se completó." });
        }
    } catch (error) {
        console.error("Error al capturar el pago:", error);
        const errorDetails = error.message || "Error al procesar la captura de pago.";
        res.status(500).json({ error: "Error al procesar el pago.", details: errorDetails });
    }
};