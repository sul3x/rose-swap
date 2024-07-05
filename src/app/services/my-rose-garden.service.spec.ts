import { TestBed } from '@angular/core/testing';

import { MyRoseGardenService } from './my-rose-garden.service';

describe('MyRoseGardenService', () => {
  let service: MyRoseGardenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyRoseGardenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
