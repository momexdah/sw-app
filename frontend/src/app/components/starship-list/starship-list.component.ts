import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Starship } from '../../models/starship.model';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-starship-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './starship-list.component.html',
  styleUrl: './starship-list.component.scss'
})
export class StarshipListComponent implements OnInit {
  @Input() personId!: number;
  starships: Starship[] = [];
  loading = false;

  constructor(private personService: PersonService) { }

  ngOnInit(): void {
    this.loadStarships();
  }

  loadStarships(): void {
    if (!this.personId) return;

    this.loading = true;
    this.personService.getPersonShips(this.personId).subscribe({
      next: (data) => {
        this.starships = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar naves:', err);
        this.loading = false;
      }
    });
  }
}