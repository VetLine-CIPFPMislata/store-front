import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { PaymentRequest, PaymentResultDto } from '../Modelos/Cart';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private urlPayments = 'http://store-back-vetline.preproducciondaw.cip.fpmislata.com/api/payments';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    processCardPayment(paymentRequest: PaymentRequest): Observable<PaymentResultDto> {
        return this.http.post<PaymentResultDto>(
            `${this.urlPayments}/card`,
            paymentRequest,
            { headers: this.getHeaders() }
        );
    }
}
