var UtilTest = TestCase("UtilitiesTest");

UtilTest.prototype.testExtend = function () {
	var empty = {};
	var extra = {key1: "k1", key2: "k2"};
	var extra2 = {key3: "k3", key4: "k4"};
	var result;

	// test extend of undefined
	result = extend(undefined, extra);
	assertEquals("Extended undefined", 2, this.countMembers(result));

	// test extend of null
	result = extend(null, extra);
	assertEquals("Extended null", 2, this.countMembers(result));

	// test extend of empty
	result = extend(empty, extra);
	assertEquals("Extended empty object", 2, this.countMembers(result));

	// test extend of same object
	result = extend(extra, extra);
	assertEquals("Extended object with object", 2, this.countMembers(result));

	// test extend of another object
	result = extend(extra, extra2);
	assertEquals("Extended object with object2", 4, this.countMembers(result));
};

UtilTest.prototype.countMembers = function (obj) {
	var count = 0;
	for (var member in obj) {
		count++;
	}

	return count;
};

UtilTest.prototype.testPInt = function () {
	// test without a base defined
	assertEquals("base not defined", 15, pInt("15"));

	// test with base 10
	assertEquals("base 10", 15, pInt("15", 10));

	// test with base 16
	assertEquals("base 16", 15, pInt("F", 16));
};

UtilTest.prototype.testIsString = function () {
	// test with undefined
	assertEquals("IsString undefined", false, isString(undefined));

	// test with null
	assertEquals("IsString null", false, isString(null));

	// test with empty object
	assertEquals("IsString {}", false, isString({}));

	// test with number
	assertEquals("IsString number", false, isString(15));

	// test with empty string
	assertEquals("IsString empty", true, isString(""));

	// test with string
	assertEquals("IsString string", true, isString("this is a string"));
};

UtilTest.prototype.testIsObject = function () {
	// test with undefined
	assertEquals("IsObject undefined", false, isObject(undefined));

	// test with null, surprise!!
	assertEquals("IsObject null", true, isObject(null));

	// test with number
	assertEquals("IsObject number", false, isObject(15));

	// test with string
	assertEquals("IsObject string", false, isObject("this is a string"));

	// test with object
	assertEquals("IsObject object", true, isObject({}));
};

UtilTest.prototype.testIsNumber = function () {
	// test with undefined
	assertEquals("IsNumber undefined", false, isNumber(undefined));

	// test with null
	assertEquals("IsNumber null", false, isNumber(null));

	// test with number
	assertEquals("IsNumber number", true, isNumber(15));

	// test with string
	assertEquals("IsNumber string", false, isNumber("this is a string"));

	// test with object
	assertEquals("IsNumber object", false, isNumber({}));
};

UtilTest.prototype.testLog2Lin = function () {
	// TODO: implement
};

UtilTest.prototype.testLin2Log = function () {
	// TODO: implement
};

/**
 * Tests if a point is inside a rectangle
 * The rectangle coordinate system is: x and y specifies the _top_ left corner width is the width and height is the height.
 */
UtilTest.prototype.pointInRect = function (x, y, rect) {
	var inside =
		x >= rect.x && x <= (rect.x + rect.width) &&
		y >= rect.y && y <= (rect.y + rect.height)
	return inside;
};

/**
 * Tests if a small rectangle is inside a bigger rectangle by testing each corner.
 */
UtilTest.prototype.rectInRect = function (smallRect, largeRect) {
	// (Maybe only two corners need to be tested)
	var inside = this.pointInRect(smallRect.x, smallRect.y, largeRect); // left top
	inside = inside && this.pointInRect(smallRect.x + smallRect.width, smallRect.y, largeRect); // right top
	inside = inside && this.pointInRect(smallRect.x + smallRect.width, smallRect.y + smallRect.height, largeRect); // right bottom
	inside = inside && this.pointInRect(smallRect.x, smallRect.y + smallRect.height, largeRect); // left bottom
	return inside;
};

/**
 * Test the placeBox utility function. It should adjust a tooltip rectangle to be inside the chart but not cover the point itself.
 */
UtilTest.prototype.testPlaceBox = function () {
	var chartRect = {x: 0, y: 0, width: 100, height: 100 },
		tooltipSize = {width: 50, height: 20},
		dataPoint = {x: 0, y: 50},
		tooltipPoint,
		boxPoint;

	boxPoint = placeBox(tooltipSize.width, tooltipSize.height, chartRect.x, chartRect.y, chartRect.width, chartRect.height, dataPoint);
	extend(boxPoint, tooltipSize);
	assertTrue('Left rectInRect chart', this.rectInRect(boxPoint, chartRect));
	assertFalse('Left tooltip cover point', this.pointInRect(dataPoint.x, dataPoint.y, boxPoint));

	dataPoint.x = 100;
	boxPoint = placeBox(tooltipSize.width, tooltipSize.height, chartRect.x, chartRect.y, chartRect.width, chartRect.height, dataPoint);
	extend(boxPoint, tooltipSize);
	assertTrue('Right rectInRect chart', this.rectInRect(boxPoint, chartRect));
	assertFalse('Right tooltip cover point', this.pointInRect(dataPoint.x, dataPoint.y, boxPoint));

	dataPoint.x = 50;
	boxPoint = placeBox(tooltipSize.width, tooltipSize.height, chartRect.x, chartRect.y, chartRect.width, chartRect.height, dataPoint);
	extend(boxPoint, tooltipSize);
	assertTrue('Mid rectInRect chart', this.rectInRect(boxPoint, chartRect));
	assertFalse('Mid tooltip cover point', this.pointInRect(dataPoint.x, dataPoint.y, boxPoint));

	dataPoint.x = 75;
	dataPoint.y = 5;
	boxPoint = placeBox(tooltipSize.width, tooltipSize.height, chartRect.x, chartRect.y, chartRect.width, chartRect.height, dataPoint);
	extend(boxPoint, tooltipSize);
	assertTrue('TopRight rectInRect chart', this.rectInRect(boxPoint, chartRect));
	assertFalse('TopRight tooltip cover point', this.pointInRect(dataPoint.x, dataPoint.y, boxPoint));
};

/**
 * Tests that the stable sort utility works.
 */
UtilTest.prototype.testStableSort = function () {
	// Initialize the array, it needs to be a certain size to trigger the unstable quicksort algorithm.
	// These 11 items fails in Chrome due to its unstable sort.
	var arr = [
			{a: 1, b: 'F'},
			{a: 2, b: 'H'},
			{a: 1, b: 'G'},
			{a: 0, b: 'A'},
			{a: 0, b: 'B'},
			{a: 3, b: 'J'},
			{a: 0, b: 'C'},
			{a: 0, b: 'D'},
			{a: 0, b: 'E'},
			{a: 2, b: 'I'},
			{a: 3, b: 'K'}
		],
		result = [];

	// Do the sort
	stableSort(arr, function (a, b) {
		return a.a - b.a;
	})

	// Collect the result
	for (var i = 0; i < arr.length; i++) {
		result.push(arr[i].b);
	}

	assertEquals('Stable sort in action', 'ABCDEFGHIJK', result.join(''));
	assertUndefined('Stable sort index should not be there', arr[0].ss_i);
};


/**
 * Tests that destroyObjectProperties calls the destroy method on properties before delete.
 */
UtilTest.prototype.testDestroyObjectProperties = function () {
	var testObject = {}, // Test object with the properties to destroy
		destroyCount = 0; // Number of destroy calls made

	/**
	 * Class containing a destroy method.
	 */
	function DummyWithDestroy() {};

	DummyWithDestroy.prototype.destroy = function () {
		destroyCount++;
		return null;
	};

	// Setup three properties with destroy methods
	testObject.rect = new DummyWithDestroy();
	testObject.line = new DummyWithDestroy();
	testObject.label = new DummyWithDestroy();

	// And one without
	testObject.noDestroy = {};

	// Destroy them all
	destroyObjectProperties(testObject);

	assertEquals('Number of destroyed elements', 3, destroyCount);
	assertUndefined('Property should be undefined', testObject.rect);
	assertUndefined('Property should be undefined', testObject.line);
	assertUndefined('Property should be undefined', testObject.label);
	assertUndefined('Property should be undefined', testObject.noDestroy);
};

/**
 * Tests that the tooltip mode is correct.
 */
UtilTest.prototype.testChooseTooltipMode = function () {
	var optionDefault,
		optionTrue = true,
		optionFalse = false,
		seriesAllNonShared = [{type: 'scatter'}, {type: 'pie'}, {type: 'pie'}],
		seriesOnePie = [{type: 'bar'}, {type: 'column'}, {type: 'pie'}],
		seriesNoPie = [{type: 'bar'}, {type: 'column'}, {type: 'scatter'}],
		seriesEmpty = [];

	assertTrue('Shared tooltip to true if set.', chooseTooltipMode(optionTrue, seriesOnePie));
	assertFalse('Shared tooltip to false if set.', chooseTooltipMode(optionFalse, seriesOnePie));

	assertTrue('Shared tooltip true as default.', chooseTooltipMode(optionDefault, seriesNoPie));
	assertTrue('Shared tooltip false if all are pies.', chooseTooltipMode(optionDefault, seriesOnePie));
	assertFalse('Shared tooltip false if all are pies.', chooseTooltipMode(optionDefault, seriesAllNonShared));
	assertTrue('Shared tooltip true if series empty.', chooseTooltipMode(optionDefault, seriesEmpty));
};

/**
 * Tests that the getEnableMouseTracker function works and selects to disable the mouse tracker.
 */
UtilTest.prototype.testGetEnableMouseTrackerDefaults = function () {
	var optionDefault,
		optionTrue = true,
		optionFalse = false,
		tooltipShared = {shared: optionTrue},
		seriesMouseTrackingDefault = {type: 'bar', enableMouseTracking: optionDefault},
		seriesMouseTrackingOn = {type: 'bar', enableMouseTracking: optionTrue},
		seriesMouseTrackingOff = {type: 'bar', enableMouseTracking: optionFalse};

	assertTrue('Enable mouseTracker if set to true.', getEnableMouseTracker(seriesMouseTrackingOn, tooltipShared));
	assertFalse('Disable mouseTracker if set to false.', getEnableMouseTracker(seriesMouseTrackingOff, tooltipShared));
	assertFalse('Disable mouseTracker if set to default.', getEnableMouseTracker(seriesMouseTrackingDefault, tooltipShared));
};

/**
 * Tests that the getEnableMouseTracker function works when shared tooltips are used.
 */
UtilTest.prototype.testGetEnableMouseTrackerSharedTooltip = function () {
	var optionDefault,
		optionTrue = true,
		optionFalse = false,
		tooltipShared = {shared: optionTrue},
		tooltipNonShared = {shared: optionFalse},
		noTooltip = optionDefault,
		seriesMouseTrackingDefault = {type: 'bar', enableMouseTracking: optionDefault};

	assertFalse('Disable mouseTracker if no tooltip.', getEnableMouseTracker(seriesMouseTrackingDefault, noTooltip));
	assertFalse('Disable mouseTracker if shared tooltips.', getEnableMouseTracker(seriesMouseTrackingDefault, tooltipShared));
	assertTrue('Enable mouseTracker if non-shared tooltips.', getEnableMouseTracker(seriesMouseTrackingDefault, tooltipNonShared));
};

/**
 * Tests that the getEnableMouseTracker function works and selects to disable the mouse tracker.
 */
UtilTest.prototype.testGetEnableMouseTrackerPlotOptionEvents = function () {
	var tooltipShared = {shared: true},
		seriesNoEvents = {point: {events: {}}},
		seriesEvents = {point: {events: {click: function () {alert('click');}}}};

	assertFalse('Disable mouseTracker if no events.', getEnableMouseTracker(seriesNoEvents, tooltipShared));
	assertTrue('Enable mouseTracker if there are events.', getEnableMouseTracker(seriesEvents, tooltipShared));
};
