import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let httpMock: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [HttpClientTestingModule, FormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
    }));

    afterEach(() => {
        httpMock.verify();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch users on search', () => {
        const searchTerm = 'test';
        const mockUsers = [{ id: 1, name: 'Test User', username: 'test', email: 'test@test.com' }];

        component.searchTerm = searchTerm;
        component.search();

        const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/users?username=${searchTerm}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockUsers);

        expect(component.users).toEqual(mockUsers);
    });

    it('should handle error when search request fails', () => {
        const searchTerm = 'test';
        const error = 'Error fetching username';

        component.searchTerm = searchTerm;
        component.search();

        const req = httpMock.expectOne(`/api/users?searchTerm=${searchTerm}`);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('network error'), { status: 404 });

        expect(console.error).toHaveBeenCalledWith('Error fetching username:', error);
    });
});
