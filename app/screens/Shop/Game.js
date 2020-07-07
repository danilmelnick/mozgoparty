const { SCREEN_TYPES } = require("./types");
const screenTypesArray = Object.values(SCREEN_TYPES);

class Game {
  // TODO add validations
  // TODO add typings
  /**
   * @constructor
   * @param {GameData} rawGameData
   */
  constructor(rawGameData) {
    this.data = this.normalizeRawGameData(rawGameData);
    this.currentScreenIndex = 0;
  }
  /**
   * @function
   * @param {GameData} rawGameData
   */
  normalizeRawGameData(rawGameData) {
    const { slides, meta, ...otherGameData } = rawGameData;
    const { leading, ...otherMeta } = meta;

    const screens = slides.reduce((accumulator, currentValue, index) => {
      const particularLeading = leading[index];
      accumulator.push({ ...currentValue, leading: particularLeading });
      return accumulator;
    }, []);

    return {
      meta: otherMeta,
      ...otherGameData,
      screens
    };
  }
  /**
   * @function
   * @return {GameData}
   */
  getGameData() {
    return { ...this.data };
  }
  /**
   * @function
   * @return {GameMeta} rawGameData
   */
  getGameMeta() {
    return { ...this.data.meta };
  }

  /**
   * @function
   * @param {GameSlide} screenData
   * @return {string} screenType
   */
  getScreenType(screenData) {
    const separator = "__";
    const screenType = screenData.type ? screenData.type : "";
    const screenPropertyType = screenData.properties
      ? screenData.properties.type
      : "";
    const screenSettingType = screenData.settings
      ? screenData.settings.type
      : "";
    const type = [screenType, screenPropertyType, screenSettingType];

    return type
      .filter(_type => _type && typeof _type === "string")
      .join(separator);
  }
  /**
   * @function
   * @param {GameSlide} screenData
   * @return {Object<{ screenType: string }> & GameSlide} screenType
   */
  getScreenData(screenData) {
    const screenType = this.getScreenType(screenData);

    console.log(screenTypesArray);

    // Think about proper error handling on UI
    if (!screenType || !screenTypesArray.some(_type => _type === screenType)) {
      throw new TypeError("Unknown screen type data");
    }

    // For future usage can create func for every type.
    // Inside this func transform data or drop redundant fields
    // switch (screenData) {
    //     case SCREEN_TYPES.TIMER:
    //         return this.processTimerScreenData(screenData);
    // }

    return {
      ...screenData,
      screenType
    };
  }
  // TODO maybe add deepClone for preventing mutate fields ???
  /**
   * @function
   * @return {Object<{ screenType: string }> & GameSlide} screenType
   */
  initialScreen() {
    this.currentScreenIndex = 0;
    const screen = this.data.screens[this.currentScreenIndex];
    return this.getScreenData(screen);
  }
  /**
   * @function
   * @return {Object<{ screenType: string }> & GameSlide} screenType
   */
  nextScreen() {
    if (!this.hasNextScreen()) return null;

    this.currentScreenIndex++;
    const screen = this.data.screens[this.currentScreenIndex];
    return this.getScreenData(screen);
  }
  /**
   * @function
   * @return {boolean} screenType
   */
  hasNextScreen() {
    return this.currentScreenIndex < this.data.screens.length - 1;
  }
}

export default Game;
