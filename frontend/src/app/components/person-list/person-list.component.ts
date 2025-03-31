import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.scss'
})
export class PersonListComponent implements OnInit {
  persons: Person[] = [];
  loading = false;
  initializing = false;
  selectedPerson: Person | null = null;
  showShipsModal = false;

  constructor(private personService: PersonService) { }

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.loading = true;
    this.personService.getPersons().subscribe({
      next: (data) => {
        this.persons = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar personajes:', err);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los personajes'
        });
      }
    });
  }

  initializeData(): void {
    this.initializing = true;
    this.personService.initializeData().subscribe({
      next: (response) => {
        console.log('Datos inicializados:', response);
        this.initializing = false;
        this.loadPersons();
        Swal.fire({
          icon: 'success',
          title: '¡Datos inicializados!',
          text: 'Los datos de Star Wars han sido cargados correctamente'
        });
      },
      error: (err) => {
        console.error('Error al inicializar datos:', err);
        this.initializing = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron inicializar los datos'
        });
      }
    });
  }

  showShips(person: Person): void {
    this.loading = true;
    this.selectedPerson = person;
    this.showShipsModal = true;

    // Cargar las naves del personaje seleccionado
    this.personService.getPersonShips(person.id).subscribe({
      next: (ships) => {
        // Asignar las naves al personaje seleccionado
        if (this.selectedPerson) {
          this.selectedPerson.starships = ships;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar naves:', err);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las naves'
        });
      }
    });
  }

  closeModal(): void {
    this.showShipsModal = false;
    this.selectedPerson = null;
  }

  deletePerson(person: Person): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar a ${person.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.personService.deletePerson(person.id).subscribe({
          next: () => {
            this.persons = this.persons.filter(p => p.id !== person.id);
            Swal.fire(
              '¡Eliminado!',
              `${person.name} ha sido eliminado correctamente.`,
              'success'
            );
          },
          error: (err) => {
            console.error('Error al eliminar persona:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el personaje'
            });
          }
        });
      }
    });
  }
}