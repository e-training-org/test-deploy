import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CategoryService } from '../services/category';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
})
export class CategoryComponent implements OnInit {
  categories$!: Observable<any[]>;

  @Input() selectedCategoryId!: number;
  @Output() selectedCategoryIdChange = new EventEmitter<number>();

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categories$ = this.categoryService.getCategories();
  }

  onChange(value: number) {
    this.selectedCategoryId = value;
    this.selectedCategoryIdChange.emit(value);
  }
}
