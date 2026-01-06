import { Component, inject, OnInit } from '@angular/core';
import { ANGULAR_MATERIAL } from '../../shared/angular-material/angular-material';
import { CommonModule } from '@angular/common';
import { ResumoFinanceiro, Transacao } from '../../core/models/transacao.model';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ...ANGULAR_MATERIAL, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  resumo?: ResumoFinanceiro;
  transacoes: Transacao[] = [];
  displayedColumns = ['data', 'descricao', 'categoria', 'valor'];

  private dashboardService = inject(DashboardService);
  public chartType: ChartType = 'doughnut';

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' }
    }
  };

  public chartData: ChartData<'doughnut'> = {
    labels: ['Receitas', 'Despesas'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#4caf50', '#f44336'], // Verde para receita, Vermelho para despesa
        hoverBackgroundColor: ['#66bb6a', '#ef5350']
      }
    ]
  };

  ngOnInit(): void {
    this.carregarDashboard();
 
  }

  private carregarDashboard(): void {
    this.dashboardService.getResumo().subscribe({
      next: (data) => {
        this.resumo = data;
        this.atualizarGrafico(data);
      }
    })
    this.dashboardService.getUltimasTransacoes().subscribe({
      next: (data) => {
        this.transacoes = data
      }
    })
  }
  private atualizarGrafico(data: ResumoFinanceiro): void {
    this.chartData = {
      ...this.chartData,
      datasets: [
        {
          ...this.chartData.datasets[0],
          data: [data.receitaMensal, data.despesaMensal]
        }
      ]
    };
  }
}
