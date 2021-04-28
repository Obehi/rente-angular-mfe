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
      console.log(changes.currentIndex);
      const currentIndex = changes.currentIndex.currentValue;

      this.nodes.forEach((node, index) => {
        if (index < currentIndex) {
          node.state = 'done';
        }

        if (index === currentIndex) {
          node.state = 'active';
        }
      });
      this.clickHeaderNode(changes.currentIndex.currentValue);
    }
  }
  clickHeaderNode(index: number): void {
    let highestIndexWithValue = 0;
    this.nodes.forEach((node) => {
      if (node.state !== 'waiting') {
        highestIndexWithValue = node.index;
      }
    });

    if (index > highestIndexWithValue) {
      return;
    }

    this.nodes
      .filter((node) => {
        return node.state === 'active' || node.state === 'active-touched';
      })
      .forEach((activeNode) => {
        activeNode.state = activeNode.value === null ? 'waiting' : 'done';
      });

    // this.nodes[index].state = 'active-touched';
    console.log('clickHeaderNode');

    this.indexChange.emit(index);
  }
}

export interface FlowHeaderNode {
  index: number;
  state: string;
  value: any;
}
