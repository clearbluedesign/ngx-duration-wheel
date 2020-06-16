import { Component, AfterViewInit, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
	selector: 'ngx-duration-wheel',
	templateUrl: 'ngx-duration-wheel.component.html',
	styleUrls: ['ngx-duration-wheel.component.scss']
})
export class NgxDurationWheelComponent implements AfterViewInit {
	private startOffsetX: number = 0;
	private startDuration: number = 0;

	@ViewChild('scrollable')
	scrollable: ElementRef<HTMLDivElement>;
	scrollableWidth: number;
	segmentWidth: number;

	get view(): string {
		if (this.duration > 0) {
			let hours = Math.floor(this.duration / 60 / 60);
			let minutes = Math.round((this.duration - (hours * 60 * 60)) / 60);

			return `${hours}h ${minutes}m`;
		}

		return '0h 0m';
	}

	@Input()
	duration: number = 0;

	@Output()
	durationChange: EventEmitter<number> = new EventEmitter<number>();

	@Input()
	step: number = 900;

	@Input()
	max: number = 86400;

	constructor(
		private element: ElementRef
	) { }

	ngAfterViewInit() {
		this.scrollableWidth = parseInt(window.getComputedStyle(this.scrollable.nativeElement).getPropertyValue('width'), 10);
		this.segmentWidth = this.scrollableWidth / (this.max / this.step);
		this.setOffset(this.duration);
	}

	onScroll(event: WheelEvent) {
		event.preventDefault();
		event.stopImmediatePropagation();

		let delta = event.deltaY < 0 ? -1 : 1;
		let addition = this.step * delta;
		let value = this.duration + addition;

		this.setValue(value);
	}

	setValue(value: number, emit: boolean = true) {
		if (value < 0) {
			value = 0;
		}

		if (value > this.max) {
			value = this.max;
		}

		if (this.duration != value) {
			this.duration = value;

			if (emit) {
				this.durationChange.emit(this.duration);
			}
		}

		this.setOffset(value);
	}

	setOffset(value: number) {
		let percent = value * 100 / this.max;
		let offset = percent * this.scrollableWidth / 100;

		this.scrollable.nativeElement.style.setProperty('transform', `translate3d(-${offset}px, 0px, 0px)`)
	}

	onDragStart(event: DragEvent) {
		let image = new Image(1, 1);
		image.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" version="1.1"%3E%3C/svg%3E';

		event.dataTransfer.setDragImage(image, 1, 1);

		this.startOffsetX = event.offsetX;
		this.startDuration = this.duration;
	}

	onDragMove(event: DragEvent) {
		let distance = this.startOffsetX - event.offsetX;
		let steps = Math.round(distance / this.segmentWidth);
		let value = steps * this.step;

		this.setValue(this.startDuration + value, false);
	}

	onDragEnd(event: DragEvent) {
		let distance = this.startOffsetX - event.offsetX;
		let steps = Math.round(distance / this.segmentWidth);
		let value = steps * this.step;

		this.duration = this.startDuration + value;

		this.setValue(this.duration, true);
	}
}
