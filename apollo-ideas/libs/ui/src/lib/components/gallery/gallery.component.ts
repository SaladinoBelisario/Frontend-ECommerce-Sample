import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-gallery',
  templateUrl: './gallery.component.html',
  styles: []
})
export class GalleryComponent implements OnInit {
  selectedImageUrl: string | undefined;

  @Input() images: string[] | undefined;

  ngOnInit(): void {
    if (this.hasImages) {
      // @ts-ignore
      this.selectedImageUrl = this.images[0];
    }
  }

  changeSelectedImage(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
  }

  get hasImages() {
    // @ts-ignore
    return this.images?.length > 0;
  }
}
