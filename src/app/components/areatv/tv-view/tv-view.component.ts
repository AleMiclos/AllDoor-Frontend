import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tv-view',
  templateUrl: './tv-view.component.html',
  styleUrls: ['./tv-view.component.css']
})
export class TvViewComponent {
  @Input() youtubeLink!: string;
  @Input() vimeoLink!: string;

  toggleFullscreen(): void {
    const elem = document.getElementById('screenContainer');
    if (!document.fullscreenElement) {
      if (elem?.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any)?.mozRequestFullScreen) {
        (elem as any).mozRequestFullScreen();
      } else if ((elem as any)?.webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any)?.msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }
}
