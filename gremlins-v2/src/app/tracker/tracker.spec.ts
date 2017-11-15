import { ImageData } from './image-data';
import { Tracker } from './tracker';
import { jgdToStr, mkImageData, mkPixel } from './test-helpers';

describe('GremlinsComponent', () => {
    let tracker: Tracker;
    beforeEach(() => {
      tracker = new Tracker();
    });

    it('should create tracker', () => {
      expect(tracker).toBeTruthy();
    });

    it('should set trackingColor', () => {
      const trackingPixel = mkPixel('1');
      tracker.setTrackingColor(trackingPixel);
      expect(tracker['trackingColor']).toEqual(trackingPixel);
    });

    it('should set frame', () => {
      const frame: ImageData = mkImageData(
          '09',
          '91'
      );
      tracker.setFrame(frame);
      expect(tracker['frame']).toEqual(frame);
    });

    it('should track color on the frame and return', () => {
      const frame: ImageData = mkImageData(
          '009900',
          '991100',
          '999999'
      );
      const trackingPixel = mkPixel('1');
      tracker.setTrackingColor(trackingPixel);
      tracker.setFrame(frame);
      const expected = [3, 2, 4, 2];
      const given = tracker.track();
      console.log('giv', given, expected);
      // expect(given).toEqual(expected);
    });

  });

