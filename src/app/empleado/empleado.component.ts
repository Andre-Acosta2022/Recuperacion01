import { Component } from '@angular/core';
import { Empleado } from '../models/empleado';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpleadoService } from '../services/empleado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [TableModule, CommonModule, RouterLink, HomeComponent,DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css'
})
export class EmpleadoComponent {
  
  formEmpleado!: FormGroup;
  visible: boolean = false;
  empleados: Empleado[] = [];
  nextId: number = 1; 
  isUpdate: boolean = false;

  constructor(private fb: FormBuilder, private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.getAllEmpleados();
    this.formEmpleado = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      correo: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', Validators.required),
    });
  }

  getAllEmpleados() {
    this.empleadoService.getEmpleado().subscribe((data) => {
      this.empleados = data;
      console.log(this.empleados);
    });
  }

  showDialog() {
    this.visible = true;
    this.isUpdate = false;
  }

  resetForm() {
    this.formEmpleado.reset();
    this.isUpdate = false;
  }

  selectEmpleado(empleado: Empleado) {
    this.isUpdate = true;
    this.visible = true;
    this.formEmpleado.controls['id'].setValue(empleado.id);
    this.formEmpleado.controls['nombre'].setValue(empleado.nombre);
    this.formEmpleado.controls['apellido'].setValue(empleado.apellido);
    this.formEmpleado.controls['correo'].setValue(empleado.correo);
    this.formEmpleado.controls['telefono'].setValue(empleado.telefono);
  }

  crearEmpleado() {
    this.empleadoService.crearEmpleado(this.formEmpleado.value).subscribe({
      next: (resp) => {
        if (resp) {
          this.showToast('success', 'Empleado creado');
          this.getAllEmpleados();
          this.resetForm();
          this.visible = false;
        }
      },
      error: (err) => {
        console.error('Error creando el empleado', err);
      },
    });
  }

  actualizarEmpleado() {
    const empleado = this.formEmpleado.value;
    if (!empleado.id) {
      this.visible = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El empleado no tiene un ID válido para actualizar.',
      });
      return;
    }

    this.empleadoService.editarEmpleado(empleado).subscribe({
      next: (resp) => {
        if (resp) {
          this.showToast('success', 'Empleado actualizado');
          this.getAllEmpleados();
          this.resetForm();
          this.visible = false;
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: 'Ocurrió un error al intentar actualizar el empleado. Intenta de nuevo más tarde.',
        });
        console.error('Error al actualizar el empleado:', err);
      },
    });
  }

  eliminarEmpleado(id: number) {
    Swal.fire({
      title: "¿Estás seguro de borrar este Empleado?",
      text: "¡No serás capaz de revertirlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#19e212",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, bórralo!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.empleadoService.eliminarEmpleado(id).subscribe(() => {
          this.getAllEmpleados();
          Swal.fire("¡Borrado!", "El empleado ha sido borrado", "success");
        });
      }
    });
  }

  private showToast(icon: 'success' | 'error', title: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#fff',
      didOpen: (Toast) => {
        Toast.onmouseenter = Swal.stopTimer;
        Toast.onmouseleave = Swal.resumeTimer;
      },
      customClass: {
        popup: 'custom-toast-popup'
      }
    });
    Toast.fire({ icon, title });
  }
}
  

