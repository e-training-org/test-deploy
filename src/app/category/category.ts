import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CategoryService } from '../services/category';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-select',
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];

  @Input() selectedCategoryId!: number;
  @Output() selectedCategoryIdChange = new EventEmitter<number>();

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      console.log('Categories loaded:', this.categories);
    });
  }

  onChange(value: number) {
    this.selectedCategoryId = value;
    this.selectedCategoryIdChange.emit(value);
  }
}