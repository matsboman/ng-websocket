import { TestBed } from '@angular/core/testing';

import { EventService } from '../services/event.service';

describe('SidebarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventService = TestBed.get(EventService);
    expect(service).toBeTruthy();
  });
});
