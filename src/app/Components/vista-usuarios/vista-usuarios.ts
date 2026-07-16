import { Component, OnInit, inject, signal, computed } from '@angular/core'; // <-- Importamos computed
import Swal from 'sweetalert2';
import { UsuarioService } from '../../Services/usuario-service';
import { RolService } from '../../Services/rol-service';
import { Usuario } from '../../Interfaces/usuario';
import { Rol } from '../../Interfaces/rol';
import { Result } from '../../Interfaces/result';

@Component({
  selector: 'app-vista-usuarios',
  standalone: true,
  imports: [],
  templateUrl: './vista-usuarios.html',
  styleUrl: './vista-usuarios.css',
})
export class VistaUsuarios implements OnInit {
  private usuarioService = inject(UsuarioService);
  private rolService = inject(RolService);

  usuarios = signal<Usuario[]>([]);
  roles = signal<Rol[]>([]);
  cargando = signal<boolean>(false);

  tabSeleccionada = signal<'activos' | 'inactivos' | 'todos'>('activos');

  usuariosFiltrados = computed(() => {
    const lista = this.usuarios();
    const filtro = this.tabSeleccionada();

    if (filtro === 'activos') {
      return lista.filter((usuario) => usuario.status === 1);
    } else if (filtro === 'inactivos') {
      return lista.filter((usuario) => usuario.status === 0);
    }

    return lista;
  });

  private idUsuarioSesion = 0;

  ngOnInit(): void {
    this.idUsuarioSesion = Number(sessionStorage.getItem('idUsuario')) ?? 0;
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cambiarTab(tab: 'activos' | 'inactivos' | 'todos'): void {
    this.tabSeleccionada.set(tab);
  }

  cargarRoles(): void {
    this.rolService.getAll().subscribe({
      next: (resultado) => {
        this.roles.set((resultado as Result<Rol>)?.objects ?? []);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los roles.',
        });
      },
    });
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.usuarioService.getAll().subscribe({
      next: (resultado) => {
        console.log(resultado);
        this.usuarios.set((resultado as Result<Usuario>)?.objects ?? []);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los usuarios.',
        });
      },
    });
  }

  private formularioHtml(usuario?: Usuario, mostrarRol: boolean = true): string {
    const u = usuario ?? ({} as Usuario);

    const opcionesRol = this.roles()
      .map(
        (r) =>
          `<option value="${r.idRol}" ${u.rol?.idRol === r.idRol ? 'selected' : ''}>${r.nombre}</option>`,
      )
      .join('');

    return `
      <div class="text-start">
        <div class="row g-2">
          <div class="col-md-4">
            <label class="form-label small mb-1">Nombre</label>
            <input id="swal-nombre" class="form-control form-control-sm" value="${u.nombre ?? ''}">
          </div>
          <div class="col-md-4">
            <label class="form-label small mb-1">Apellido Paterno</label>
            <input id="swal-apellidoPaterno" class="form-control form-control-sm" value="${u.apellidoPaterno ?? ''}">
          </div>
          <div class="col-md-4">
            <label class="form-label small mb-1">Apellido Materno</label>
            <input id="swal-apellidoMaterno" class="form-control form-control-sm" value="${u.apellidoMaterno ?? ''}">
          </div>
          <div class="col-md-6">
            <label class="form-label small mb-1">Usuario</label>
            <input id="swal-username" class="form-control form-control-sm" value="${u.username ?? ''}">
          </div>
          <div class="col-md-6">
            <label class="form-label small mb-1">Email</label>
            <input id="swal-email" type="email" class="form-control form-control-sm" value="${u.email ?? ''}">
          </div>
          <div class="col-md-6">
            <label class="form-label small mb-1">Celular</label>
            <input id="swal-celular" class="form-control form-control-sm" value="${u.celular ?? ''}">
          </div>
          <div class="col-md-6">
            <label class="form-label small mb-1">Teléfono</label>
            <input id="swal-telefono" class="form-control form-control-sm" value="${u.telefono ?? ''}">
          </div>
          ${
            mostrarRol
              ? `
          <div class="col-md-6">
            <label class="form-label small mb-1">Rol</label>
            <select id="swal-rol" class="form-select form-select-sm">
              <option value="">Selecciona un rol</option>
              ${opcionesRol}
            </select>
          </div>
          `
              : ''
          }
          ${
            usuario
              ? ''
              : `
          <div class="col-md-6">
            <label class="form-label small mb-1">Contraseña</label>
            <input id="swal-password" type="password" class="form-control form-control-sm">
          </div>
          `
          }
        </div>
      </div>
    `;
  }

  private leerFormulario(esEdicion: boolean, mostrarRol: boolean): Usuario | false {
    const val = (id: string) =>
      (document.getElementById(id) as HTMLInputElement)?.value.trim() ?? '';

    const nombre = val('swal-nombre');
    const username = val('swal-username');
    const email = val('swal-email');
    const password = val('swal-password');

    if (!nombre || !username || !email) {
      Swal.showValidationMessage('Nombre, usuario y email son obligatorios.');
      return false;
    }

    if (!esEdicion && !password) {
      Swal.showValidationMessage('La contraseña es obligatoria.');
      return false;
    }

    let rol: Rol | null = null;
    if (mostrarRol) {
      const idRolSeleccionado = Number(val('swal-rol'));
      if (!idRolSeleccionado) {
        Swal.showValidationMessage('Selecciona un rol.');
        return false;
      }
      rol = this.roles().find((r) => r.idRol === idRolSeleccionado) ?? null;
    }

    return {
      idUsuario: 0,
      nombre,
      apellidoPaterno: val('swal-apellidoPaterno'),
      apellidoMaterno: val('swal-apellidoMaterno'),
      username,
      email,
      celular: val('swal-celular'),
      telefono: val('swal-telefono'),
      password,
      rol: rol as any,
    };
  }

  abrirModalNuevo(): void {
    Swal.fire({
      title: '<i class="bi bi-person-plus me-2"></i>Nuevo Usuario',
      html: this.formularioHtml(undefined, true),
      width: 600,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '<i class="bi bi-check-lg me-1"></i>Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => this.leerFormulario(false, true),
    }).then((resultado) => {
      if (resultado.isConfirmed && resultado.value) {
        this.crear(resultado.value as Usuario);
      }
    });
  }

  abrirModalEditar(usuario: Usuario): void {
    const esPropioPerfil = usuario.idUsuario === this.idUsuarioSesion;
    const mostrarRol = !esPropioPerfil;

    Swal.fire({
      title: '<i class="bi bi-person-gear me-2"></i>Editar Usuario',
      html: this.formularioHtml(usuario, mostrarRol),
      width: 600,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '<i class="bi bi-check-lg me-1"></i>Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => this.leerFormulario(true, mostrarRol),
    }).then((resultado) => {
      if (resultado.isConfirmed && resultado.value) {
        const datos = resultado.value as Usuario;
        const actualizado: Usuario = {
          ...usuario,
          ...datos,
          idUsuario: usuario.idUsuario,
          password: usuario.password,
          rol: mostrarRol ? datos.rol : usuario.rol,
        };
        this.actualizar(actualizado);
      }
    });
  }

  private crear(usuario: Usuario): void {
    this.usuarioService.add(usuario).subscribe({
      next: () => {
        this.cargarUsuarios();
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el usuario.' });
      },
    });
  }

  private actualizar(usuario: Usuario): void {
    this.usuarioService.update(usuario).subscribe({
      next: (result) => {
        this.cargarUsuarios();
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        if (err.status) {
          const mensajeError = err.error?.message || 'Ocurrió un error inesperado';

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensajeError,
          });
        }
      },
    });
  }

  eliminar(usuario: Usuario): void {
    const activar = usuario.status === 0;
    if (usuario.idUsuario == this.idUsuarioSesion) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se puede borrar el usuario de la session`,
        showCancelButton: false,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: activar ? '¿Activar Usuario?' : '¿Desactivar Usuario?',
        text: `Se eliminará a ${usuario.nombre} ${usuario.apellidoPaterno}.`,
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
      }).then((resultado) => {
        if (!resultado.isConfirmed) return;

        this.usuarioService.delete(usuario.idUsuario).subscribe({
          next: (result) => {
            this.cargarUsuarios();
            Swal.fire({
              icon: 'success',
              title: result.message,
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: () => {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el usuario.' });
          },
        });
      });
    }
  }
}
