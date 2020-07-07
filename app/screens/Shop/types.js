const SCREEN_TYPES = Object.freeze({
  TOUR: "tour", // maybe TOUR_START or smth like that
  TIMER: "slide-timer",

  SIMPLE_QUESTION__QUESTION: "question__question",
  SIMPLE_QUESTION__REPEAT: "question__repeat",

  MEDIA_SWITCH_IN_ANSWER_WITH_QUESTION__ANSWER:
    "media-switch-in-answer-with-question-s-v-g__answer",
  TEXT_AND_TWO_IMAGE_ANSWER__QUESTION: "text-and-two-image-answer__question",

  TEXT_AND_TWO_IMAGE_ANSWER__REPEAT: "text-and-two-image-answer__repeat",

  MEDIA_SWITCH_IN_ANSWER__ANSWER: "media-switch-in-answer__answer",

  TEXT_AND_SOUNDS__QUESTION: "text-and-sounds__question",
  TEXT_AND_SOUNDS__REPEAT: "text-and-sounds__repeat",
  TEXT_AND_SOUNDS__ANSWER: "text-and-sounds__answer",

  VIDEO_SLIDE: "video-slide",
  VIDEO_SLIDE__CLICK_PLAY: "video-slide__click_play",
  VIDEO_SLIDE__3_SECONDS_SKIP: "video-slide__3_seconds_skip",
  VIDEO_SLIDE__LINK: "video-slide__link"

  // TODO create const for this types. Was absent in example game json
  // text-and-image-answer
  // text-and-video-answer
  // image-and-video-in-answer-opp.
});

// TODO add another types base on diff games analysis
const LEADING_ITEM_EVENT_TYPES = Object.freeze({
  GLOBAL_SPACE: "global.space",
  VIDEO_END: "videoend",
  START: "start",
  SPACE: "space",
  AUDIO_END: "audioend",
  START_TIMER: "start-timer",
  END_TIMER: "end-timer",
  TIMEOUT: "timeout"
});

// TODO add another types base on diff games analysis
const LEADING_ITEM_ACTION_TYPES = Object.freeze({
  NEXT_SLIDE: "next-slide",
  PLAY_ANIMATION: "play-animation",
  AUDIO: "audio",
  START_TIMER: "start-timer",
  DELAY_ACTION: "delay-action",
  SPACE: "space"
});

module.exports = {
  SCREEN_TYPES,
  LEADING_ITEM_EVENT_TYPES,
  LEADING_ITEM_ACTION_TYPES
};

/**
 * @typedef {Object} GameLeadingItem
 * @property {string} event - one of LEADING_ITEM_EVENT_TYPES
 * @property {string} action - one of LEADING_ITEM_ACTION_TYPES
 * @property {number} [registerAfter]
 * @property {Array<string|number|Array>} [params]
 * @property {number} [delay]
 * @property {boolean} [once]
 * @property {Array<GameLeadingItem>} [after]
 */

/**
 * @typedef {Object} GameSlideMarkup
 * @property {number} left_width
 * @property {number} right_width
 * @property {number} left_font
 * @property {number} answer_font
 */

/**
 * @typedef {Object} GameSlideProperties
 * @property {string} type - one of value 'question', 'repeat', 'answer'
 * @property {boolean} [half]
 * @property {boolean} [out]
 * @property {string} [background]
 * @property {string} [videoStart]
 * @property {Object<{ text: {string} }>} [text]
 * @property {GameSlideMarkup} [markup]
 * @property {number} [seconds]
 * @property {string} [secondImage]
 * @property {string} [sound]
 * @property {string} [sounds]
 * @property {string} [answer]
 * @property {Object<{ text: string }>} [textAnswer]
 * @property {string} [image]
 * @property {boolean} [icon]
 * @property {boolean} [autoplay]
 * @property {string} [link]
 */

/**
 * @typedef {Object} GameSlideSettings
 * @property {string} type
 * @property {Object} properties
 */

/**
 * @typedef {Object} GameSlide
 * @property {string} id
 * @property {string} type
 * @property {GameSlideProperties} properties
 * @property {GameSlideSettings} [settings]
 * @property {number} tour
 * @property {number} slide
 * @property {boolean} [hasTimer]
 * @property {boolean} [hasSound]
 * @property {boolean} [hasRepeat]
 */

/**
 * @typedef {Object} GameMeta
 * @property {Object} tours - { "1": 1, "2": 5, "3": 3, "4": 7 }
 * @property {boolean} cached
 * @property {Array<GameLeadingItem>} leading
 * @property {string} gameBackground
 * @property {string} gameStrongFont
 * @property {string} gameType
 * @property {string} gameTopic
 * @property {Object} questionsCount
 * @property {number} questionTimer
 * @property {number} blitzTimer
 * @property {string} blitzTimerMedia
 * @property {string} party_game_type
 */

/**
 * @typedef {Object} GameData
 * @property {GameMeta} meta
 * @property {Array<GameSlide>} slides
 * @property {*} audio
 */
