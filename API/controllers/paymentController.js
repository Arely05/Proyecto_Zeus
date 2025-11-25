import client from '../config/paypal.js';
import paypal from '@paypal/checkout-server-sdk';
import db from '../config/db.js'; 

const createOrderInDB = async (paypalCaptureData, cartItems, userId) => {
     const purchaseUnit = (paypalCaptureData.purchase_units && paypalCaptureData.purchase_units.length > 0)
                         ? paypalCaptureData.purchase_units[0] : null;
    const capture = (purchaseUnit && purchaseUnit.payments && purchaseUnit.payments.captures && purchaseUnit.payments.captures.length > 0)
                    ? purchaseUnit.payments.captures[0] : null;

    if (!capture || !capture.amount || !purchaseUnit || !cartItems) {
        console.error("Error: Estructura de datos de PayPal inesperada.");
        throw new Error("Datos de PayPal insuficientes.");
    }

    const paypalTotalString = capture.amount.value;
    const total = parseFloat(paypalTotalString); 

    try {
        const orderSql = "INSERT INTO pedido (id_usuario, total, estado, fecha) VALUES (?, ?, 'COMPLETADO', NOW())";
        const [orderResult] = await db.query(orderSql, [userId, total]);
        const orderId = orderResult.insertId;

        const detailsPromises = cartItems.map(cartItem => { 
            const detailSql = "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unidad) VALUES (?, ?, ?, ?)";
            const unitPrice = parseFloat(cartItem.product?.precio || 0);
            return db.query(detailSql, [orderId, cartItem.product.id, cartItem.quantity, unitPrice]);
        });
        await Promise.all(detailsPromises);
        
        const stockUpdatePromises = cartItems.map(cartItem => {
            const updateSql = "UPDATE producto SET stock = stock - ? WHERE id = ?";
            return db.query(updateSql, [cartItem.quantity, cartItem.product.id]);
        });
        await Promise.all(stockUpdatePromises);

        return orderId;
    } catch (err) {
        console.error('ERROR CRÍTICO:', err.message || err);
        throw new Error('Falló el registro en la base de datos.');
    }
};

export const createOrder = async (req, res) => {
    const { items, userId } = req.body;
     
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "El carrito de compras está vacío." });
    }

    try {
        let totalCalculado = 0;
        const paypalItems = [];

        //validamos stock
        for (const item of items) {
            const [rows] = await db.query('SELECT id, nombre, precio, descripcion, stock FROM producto WHERE id = ?', [item.product.id]);
            
            if (rows.length === 0) {
                return res.status(404).json({ error: `El producto con ID ${item.product.id} no existe.` });
            }

            const productoBD = rows[0];

            if (productoBD.stock < item.quantity) {
                return res.status(409).json({ 
                    error: `Stock insuficiente para "${productoBD.nombre}".`,
                    details: `Solo quedan ${productoBD.stock} unidades disponibles.`
                });
            }

            const precioUnitario = parseFloat(productoBD.precio);
            totalCalculado += precioUnitario * item.quantity;

            paypalItems.push({
                name: productoBD.nombre,
                description: productoBD.descripcion || 'Sin descripción',
                unit_amount: { currency_code: "MXN", value: precioUnitario.toFixed(2) },
                quantity: item.quantity.toString(),
                sku: productoBD.id.toString()
            });
        }

        const totalValue = totalCalculado.toFixed(2);

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            application_context: {
                brand_name: "Zeus Vet",
                locale: "es-MX",
                user_action: "PAY_NOW",
                return_url: "http://localhost:4200/checkout", 
                cancel_url: "http://localhost:4200/checkout" 
            },
            purchase_units: [
                {
                    amount: {
                        currency_code: "MXN",
                        value: totalValue, 
                        breakdown: { item_total: { currency_code: "MXN", value: totalValue } }
                    },
                    items: paypalItems, 
                    custom_id: userId.toString()
                }
            ]
        });

        const order = await client.execute(request);
        return res.status(201).json({ id: order.result.id, status: order.result.status });

    } catch (error) {
        console.error("Error en createOrder:", error);
        if (!res.headersSent) {
            const errorDetails = error.result?.details?.[0]?.description || error.message;
            return res.status(500).json({ error: "Error al procesar la solicitud.", details: errorDetails });
        }
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
        res.status(500).json({ error: "Error al procesar el pago." });
    }
};