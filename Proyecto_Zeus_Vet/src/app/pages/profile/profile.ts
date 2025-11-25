import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AuthService } from '../../services/auth'; 
import { User } from '../../models/user';
import { Observable, Subscription } from 'rxjs';
import { Order } from '../../models/order'; 
import { Product } from '../../models/product'; 
import { ProductService } from '../../services/product'; 
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, DecimalPipe], 
  templateUrl: './profile.html', 
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

    user$: Observable<User | null>;
    currentUser: User | null = null;
    isEditing: boolean = false; 
    editForm!: FormGroup;
    error: string = '';
    private userSubscription: Subscription;
    
    orderHistory: Order[] = []; 
    inventoryProducts: Product[] = []; 

    isProductModalOpen: boolean = false;
    isCreating: boolean = false; 
    selectedProduct: Product = { id: 0, nombre: '', descripcion: '', precio: 0, imagen: '', stock: 0, activo: 1 };
    
    selectedFile: File | null = null;
    imagePreview: string | null = null;

    constructor(
        private authService: AuthService, 
        private productService: ProductService,
        private fb: FormBuilder,
        private router: Router
    ) {
        this.user$ = this.authService.currentUser$;
        
        this.userSubscription = this.user$.subscribe(user => {
            this.currentUser = user;
            if (user) {
                this.initForm(user);
                this.loadOrderHistory(user.id);
                
                if (user.administrador === 1) {
                    this.loadInventory();
                }
            } else {
                this.orderHistory = [];
                this.inventoryProducts = [];
            }
        });
    }

    ngOnInit(): void {}

    ngOnDestroy() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    loadInventory(): void {
        this.productService.getAdminProducts().subscribe({
            next: (products) => {
                this.inventoryProducts = products;
            },
            error: (err) => console.error('Error cargando inventario', err)
        });
    }

    saveStock(product: Product): void {
        if (product.stock < 0) return;
        
        this.productService.updateStock(product.id, product.stock).subscribe({
            next: () => {
                alert(`Stock de "${product.nombre}" actualizado correctamente.`);
            },
            error: (err) => {
                alert('Error al actualizar el stock.');
                console.error(err);
            }
        });
    }

    toggleStatus(product: Product): void {
        const nuevoEstado = product.activo === 1 ? 0 : 1;
        const accion = nuevoEstado === 1 ? 'activar' : 'ocultar';

        if (confirm(`¿Seguro que quieres ${accion} el producto "${product.nombre}"?`)) {
            this.productService.updateStatus(product.id, nuevoEstado).subscribe({
                next: () => {
                    
                    product.activo = nuevoEstado;
                },
                error: (err) => {
                    console.error(err);
                    alert('Error al cambiar el estado del producto.');
                }
            });
        }
    }


    openCreateProductModal(): void {
        this.isCreating = true;
        this.selectedProduct = { id: 0, nombre: '', descripcion: '', precio: 0, imagen: '', stock: 0, activo: 1 };
        this.imagePreview = null;
        this.selectedFile = null;
        this.isProductModalOpen = true;
    }

    openEditProductModal(product: Product): void {
        this.isCreating = false;
        this.selectedProduct = { ...product };
        this.imagePreview = product.imagen; 
        this.selectedFile = null; 
        this.isProductModalOpen = true;
    }

    closeProductModal(): void {
        this.isProductModalOpen = false;
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    saveProductChanges(): void {
        const formData = new FormData();
        formData.append('id', this.selectedProduct.id.toString());
        formData.append('nombre', this.selectedProduct.nombre);
        formData.append('descripcion', this.selectedProduct.descripcion);
        formData.append('precio', this.selectedProduct.precio.toString());
        formData.append('stock', this.selectedProduct.stock.toString());

        if (this.selectedFile) {
            formData.append('imagen', this.selectedFile);
        } else {
            formData.append('imagen', this.selectedProduct.imagen || '');
        }

        if (this.isCreating) {
            this.productService.createProduct(formData).subscribe({
                next: () => {
                    alert('Producto creado con éxito.');
                    this.isProductModalOpen = false;
                    this.loadInventory(); 
                },
                error: (err) => {
                    console.error(err);
                    alert('Error al crear el producto.');
                }
            });
        } else {
            this.productService.updateProductFull(formData).subscribe({
                next: () => {
                    alert('Producto actualizado con éxito.');
                    this.isProductModalOpen = false;
                    this.loadInventory(); 
                },
                error: (err) => {
                    console.error(err);
                    alert('Error al actualizar el producto.');
                }
            });
        }
    }

    loadOrderHistory(userId: number): void {
        this.authService.getOrderHistory(userId).subscribe({
            next: (orders) => {
                this.orderHistory = orders;
            },
            error: (err) => {
                console.error("Fallo al cargar historial:", err);
            }
        });
    }

    initForm(user: User): void {
        this.editForm = this.fb.group({
            nombre: [user.nombre, [Validators.required]],
            email: [user.email, [Validators.required, Validators.email]],
            direccion: [user.direccion, [Validators.required]]
        });
    }

    enableEdit(): void {
        this.isEditing = true;
        if (this.currentUser) {
             this.initForm(this.currentUser);
        }
        this.error = '';
    }

    cancelEdit(): void {
        this.isEditing = false;
    }

    onUpdate(): void {
        if (this.editForm.invalid || !this.currentUser) return;

        this.error = '';
        const updatedData: User = {
            ...this.currentUser, 
            ...this.editForm.value 
        };

        this.authService.updateUser(updatedData).subscribe({
            next: (user) => {
                this.isEditing = false; 
            },
            error: (err) => {
                this.error = err.message || 'Error al actualizar el perfil.';
            }
        });
    }

    onDelete(): void {
        if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.')) {
            if (!this.currentUser) return;

            this.authService.deleteUser(this.currentUser.id).subscribe({
                next: () => {
                    this.router.navigate(['/register']); 
                },
                error: (err) => {
                    this.error = err.message || 'Error al eliminar la cuenta.';
                }
            });
        }
    }

    get nombre() { return this.editForm.get('nombre'); }
    get email() { return this.editForm.get('email'); }
    get direccion() { return this.editForm.get('direccion'); }
}