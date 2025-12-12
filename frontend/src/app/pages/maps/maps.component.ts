import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { WebSocketService } from 'src/app/services/web-socket-service.service';
import { OrdenService } from 'src/app/services/orden.service';
import { MotoService } from 'src/app/services/moto.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface MotorcycleMarker {
  marker: L.Marker;
  polyline: L.Polyline;
  licensePlate: string;
  orderId?: number;
  positions: L.LatLng[];
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, AfterViewInit, OnDestroy {
  
  private map!: L.Map;
  private motorcycleMarkers: Map<string, MotorcycleMarker> = new Map();
  private subscriptions: Subscription[] = [];
  
  ordersWithTracking: any[] = [];
  selectedOrder: any = null;
  isConnected: boolean = false;
  
  // Estadísticas
  totalOrders: number = 0;
  activeDeliveries: number = 0;
  completedToday: number = 0;

  constructor(
    private webSocketService: WebSocketService,
    private ordenService: OrdenService,
    private motoService: MotoService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.connectWebSocket();
    this.calculateStats();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  /**
   * Inicializa el mapa de Leaflet
   */
  private initMap(): void {
    const mapElement = document.getElementById('map-canvas');
    if (!mapElement) {
      console.error('❌ Elemento del mapa no encontrado');
      return;
    }

    // Coordenadas de Chinchiná, Caldas, Colombia
    this.map = L.map('map-canvas').setView([5.0556, -75.4908], 14);

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Fix para los iconos de Leaflet
    this.fixLeafletIcons();

    console.log('✅ Mapa inicializado');
  }

  /**
   * Fix para los iconos de Leaflet en Angular
   */
  private fixLeafletIcons(): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  /**
   * Conecta al WebSocket
   */
  private connectWebSocket(): void {
    this.webSocketService.connect();
    this.isConnected = this.webSocketService.isConnected();
    console.log('🔌 WebSocket conectado:', this.isConnected);
  }

  /**
   * Carga las órdenes desde el backend
   */
  private loadOrders(): void {
    this.ordenService.list().subscribe({
      next: (orders) => {
        this.ordersWithTracking = orders.filter(o => o.motorcycle_id && o.status !== 'delivered');
        console.log('📦 Órdenes con motocicleta:', this.ordersWithTracking);
      },
      error: (err) => {
        console.error('❌ Error cargando órdenes:', err);
        Swal.fire('Error', 'No se pudieron cargar las órdenes', 'error');
      }
    });
  }

  /**
   * Calcula estadísticas
   */
  private calculateStats(): void {
    this.ordenService.list().subscribe({
      next: (orders) => {
        this.totalOrders = orders.length;
        this.activeDeliveries = orders.filter(o => o.status === 'in_progress').length;
        this.completedToday = orders.filter(o => o.status === 'delivered').length;
      },
      error: (err) => console.error('Error calculando stats:', err)
    });
  }

  /**
   * Inicia el tracking de una orden específica
   */
  startTracking(order: any): void {
    this.selectedOrder = order;

    // Obtener datos de la motocicleta
    this.motoService.view(order.motorcycle_id).subscribe({
      next: (motorcycle) => {
        const licensePlate = motorcycle.license_plate;
        
        // Iniciar tracking en el backend
        this.http.post(`${environment.url_backend}/motorcycles/track/${licensePlate}`, {})
          .subscribe({
            next: (response: any) => {
              console.log('✅ Tracking iniciado:', response);
              
              // Escuchar eventos del canal de esta motocicleta
              const sub = this.webSocketService.listen(licensePlate).subscribe({
                next: (data) => {
                  this.updateMotorcyclePosition(licensePlate, data, order.id);
                },
                error: (err) => {
                  console.error('❌ Error en canal WebSocket:', err);
                }
              });
              
              this.subscriptions.push(sub);
              
              Swal.fire({
                icon: 'success',
                title: 'Tracking iniciado',
                text: `Siguiendo motocicleta ${licensePlate}`,
                timer: 2000,
                showConfirmButton: false
              });
            },
            error: (err) => {
              console.error('❌ Error iniciando tracking:', err);
              Swal.fire('Error', 'No se pudo iniciar el tracking', 'error');
            }
          });
      },
      error: (err) => {
        console.error('❌ Error obteniendo motocicleta:', err);
      }
    });
  }

  /**
   * Detiene el tracking de una orden
   */
  stopTracking(order: any): void {
    this.motoService.view(order.motorcycle_id).subscribe({
      next: (motorcycle) => {
        const licensePlate = motorcycle.license_plate;
        
        // Detener tracking en el backend
        this.http.post(`${environment.url_backend}/motorcycles/stop/${licensePlate}`, {})
          .subscribe({
            next: (response: any) => {
              console.log('🛑 Tracking detenido:', response);
              
              // Remover marcador y línea del mapa
              const motorcycleData = this.motorcycleMarkers.get(licensePlate);
              if (motorcycleData) {
                this.map.removeLayer(motorcycleData.marker);
                this.map.removeLayer(motorcycleData.polyline);
                this.motorcycleMarkers.delete(licensePlate);
              }
              
              Swal.fire({
                icon: 'info',
                title: 'Tracking detenido',
                text: `Se detuvo el seguimiento de ${licensePlate}`,
                timer: 2000,
                showConfirmButton: false
              });
              
              if (this.selectedOrder?.id === order.id) {
                this.selectedOrder = null;
              }
            },
            error: (err) => {
              console.error('❌ Error deteniendo tracking:', err);
            }
          });
      }
    });
  }

  /**
   * Detiene todos los trackings activos
   */
  stopAllTracking(): void {
    this.motorcycleMarkers.forEach((data, licensePlate) => {
      this.http.post(`${environment.url_backend}/motorcycles/stop/${licensePlate}`, {})
        .subscribe({
          next: () => {
            this.map.removeLayer(data.marker);
            this.map.removeLayer(data.polyline);
          },
          error: (err) => console.error('Error deteniendo:', err)
        });
    });
    
    this.motorcycleMarkers.clear();
    this.selectedOrder = null;
    
    Swal.fire({
      icon: 'info',
      title: 'Todos los trackings detenidos',
      timer: 2000,
      showConfirmButton: false
    });
  }

  /**
   * Actualiza la posición de la motocicleta en el mapa
   */
  private updateMotorcyclePosition(licensePlate: string, coordinates: any, orderId: number): void {
    const { lat, lng } = coordinates;

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      console.warn('⚠️ Coordenadas inválidas:', coordinates);
      return;
    }

    const newLatLng = L.latLng(lat, lng);

    // Icono personalizado para motocicleta (usando emoji como fallback)
    const motorcycleIcon = L.divIcon({
      html: `<div style="font-size: 24px; text-align: center;">🏍️</div>`,
      className: 'motorcycle-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    let motorcycleData = this.motorcycleMarkers.get(licensePlate);

    if (!motorcycleData) {
      // Crear nuevo marcador
      const marker = L.marker(newLatLng, { icon: motorcycleIcon })
        .addTo(this.map)
        .bindPopup(`
          <div style="text-align: center;">
            <b>🏍️ ${licensePlate}</b><br>
            <small>Orden #${orderId}</small>
          </div>
        `);
      
      // Crear polyline para la ruta
      const polyline = L.polyline([newLatLng], {
        color: '#5e72e4',
        weight: 3,
        opacity: 0.7,
        smoothFactor: 1
      }).addTo(this.map);

      motorcycleData = { 
        marker, 
        polyline,
        licensePlate, 
        orderId,
        positions: [newLatLng]
      };
      this.motorcycleMarkers.set(licensePlate, motorcycleData);
      
      // Centrar mapa en la primera posición
      this.map.setView(newLatLng, 16);
    } else {
      // Actualizar posición del marcador existente
      motorcycleData.marker.setLatLng(newLatLng);
      
      // Agregar posición a la ruta
      motorcycleData.positions.push(newLatLng);
      motorcycleData.polyline.setLatLngs(motorcycleData.positions);
      
      // Centrar mapa suavemente
      this.map.panTo(newLatLng);
    }

    console.log(`📍 ${licensePlate} en:`, { lat, lng });
  }

  ngOnDestroy(): void {
    // Detener todos los trackings
    this.stopAllTracking();
    
    // Limpiar suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Desconectar WebSocket
    this.webSocketService.disconnect();
    
    console.log('🧹 Componente destruido');
  }
}