import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { EfmDialogHeaderComponent } from '../../../efm-components/dialog/public-api';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-sanctions-details',
  standalone: true,
  imports: [EfmDialogHeaderComponent, MatDividerModule, MatButtonModule, MatDialogModule, CommonModule, MatTableModule, KeyValuePipe],
  templateUrl: './sanctions-details.component.html',
  styleUrls: ['./sanctions-details.component.scss']
})
export class SanctionsDetailsComponent {
  data: any;
  entityNames!: string[];
  llmDesc!: any[];
  sancEntity!: any;
  formattedSwiftMessage!: string;
  sanctionedEntities!: { [key: string]: any[] };
  constructor(
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.data = data;
  }
  ngOnInit(): void {
    console.log(this.data);
    this.formattedSwiftMessage = this.formatSwiftMessage(this.data.swift_message);
    this.entityNames = JSON.parse(this.data.entity_names.replace(/'/g, '"'));
    this.llmDesc = [this.data.llm_decisions.slice(1, -1).replace(/'/g, '"')];
    this.sancEntity = this.data.sanctioned_entities.replace(/'/g, '"');
    console.log(this.sancEntity);
  }
  formatSwiftMessage(swiftMessage: string): string {
    const formattedMessage = swiftMessage
      .replace(/'/g, '"') // Replace single quotes with double quotes
      .replace(/\\n/g, '\n') // Replace escaped newlines with actual newlines
      .replace(/({|})/g, '') // Remove curly braces
      .split(',') // Split by comma
      .map(line => line.trim()) // Trim each line
      .join('\n'); // Join lines with newline
    return formattedMessage;
  }
}
