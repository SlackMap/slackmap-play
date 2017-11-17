import { Tracker, getBoxCenter } from './tracker';
import { mkImageData, mkPixel } from './test-helpers';
import { expect } from 'chai';

describe('Tracker', () => {
  let tracker: Tracker;
  beforeEach(() => {
    tracker = new Tracker();
  });

  it('should create tracker', () => {
    expect(tracker).to.exist;
  });

  it('should set trackingColor', () => {
    const trackingPixel = mkPixel('1');
    tracker.setTrackingColor(trackingPixel);
    expect(tracker['trackingColor']).to.equal(trackingPixel);
  });

  it('should set frame', () => {
    const frame: ImageData = mkImageData(
      '09',
      '91'
    );
    tracker.setFrame(frame);
    expect(tracker['frame']).to.equal(frame);
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
    const given = tracker.track();

    const expected = [3, 2, 4, 2];


    expect(given).to.equal(expected);

  });

  it('should return tracked box image data', () => {

    const frame: ImageData = mkImageData(
      '009900',
      '991100',
      '999999'
    );
    const expected: ImageData = mkImageData(
      '------',
      '--00--',
      '------'
    );

    const trackingPixel = mkPixel('1');

    tracker.setTrackingColor(trackingPixel);
    tracker.setFrame(frame);
    tracker.track();
    const given = tracker.getTrackedColorMesh();
    expect(given).to.equal(expected);

  });

});

describe('getBoxCenter', () => {
  it('should return center of the box', () => {
    const center = getBoxCenter([10, 5, 20, 15]);
    expect(center).to.equal([15, 10]);
  });
});

