import widgetAnalytics from 'products-and-docs/widgets/helpers/widgets-analytics.js';

describe('widget-analytics', () => {
  window.ga = jest.fn();

  it('#sendEvent should call ga function', () => {
    const requestOptions = { eventCategory: 'widgetCategory', eventAction: 'widgetEvent' };
    widgetAnalytics.sendEvent(requestOptions);
    expect(ga).toHaveBeenCalledTimes(2);
    expect(ga).toHaveBeenCalledWith('send', 'event', expect.objectContaining(requestOptions));
    expect(ga).toHaveBeenCalledWith('tmOpenPlatform.send', 'event', expect.objectContaining(requestOptions));
  });
});
