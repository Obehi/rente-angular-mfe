import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'rente-flow-header',
  templateUrl: './flow-header.component.html',
  styleUrls: ['./flow-header.component.scss']
})
export class FlowHeaderComponent implements OnInit {
  @Input() nodes: FlowHeaderNode[];
  @Input() currentIndex: number;
  @Output() indexChange: EventEmitter<any> = new EventEmitter();

  currentNode: number;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentIndex && changes.currentIndex.currentValue) {
      const currentIndex = changes.currentIndex.currentValue;
      this.nodes[currentIndex].state = 'active';
      this.handleNodeChange(currentIndex);
    }
  }

  clickHeaderNode(currentIndex: number): void {
    if (this.nodes[currentIndex].state === 'waiting') {
      return;
    }
    this.handleNodeChange(currentIndex);
    this.indexChange.emit(currentIndex);
  }

  handleNodeChange(currentIndex: number): void {
    let highestIndexWithValue = 0;
    this.nodes.forEach((node) => {
      if (node.state !== 'waiting') {
        highestIndexWithValue = node.index;
      }
    });

    if (currentIndex > highestIndexWithValue) {
      return;
    }
    this.nodes.forEach((node, itemIndex) => {
      if (itemIndex < currentIndex) {
        node.state = 'done';
      } else if (itemIndex === currentIndex) {
        node.state = 'active';
      }
      if (itemIndex <= highestIndexWithValue - 1) {
        node.state = 'active-touched';
      }

      if (itemIndex === highestIndexWithValue + 1 && node.state !== 'waiting') {
        node.state = 'active';
      }
    });
  }
}

export interface FlowHeaderNode {
  index: number;
  state: string;
  value: any;
}
