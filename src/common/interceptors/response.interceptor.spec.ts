// src/common/interceptors/response.interceptor.spec.ts
import { ResponseInterceptor } from './response.interceptor';
import { of } from 'rxjs';

describe('ResponseInterceptor', () => {
  it('should return a formatted response', (done) => {
    const interceptor = new ResponseInterceptor();
    const executionContext: any = {
      switchToHttp: () => ({
        getResponse: () => ({}),
      }),
    };

    const callHandler = {
      handle: () => of({ data: 'test data' }),
    };

    interceptor.intercept(executionContext, callHandler).subscribe((response) => {
      expect(response.status).toBe('ok');
      expect(response.response).toEqual({ data: 'test data' });
      done();
    });
  });
});
