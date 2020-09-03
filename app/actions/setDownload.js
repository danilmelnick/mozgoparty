import AsyncStorage from "@react-native-community/async-storage";
import Game from "../screens/Shop/Game";

var RNFS = require("react-native-fs");

let jobIds = [];
let cancelDownloadVariable = false;
let number = [];
let persent1 = [];
let persent2 = [];
let persent3 = [];

export const setCancelDownloadVariable = (cancel, gameId) => {
  cancelDownloadVariable = cancel;
  number[gameId] = 0;
  persent1[gameId] = 0;
  persent2[gameId] = 0;
  persent3[gameId] = 0;

  if (jobIds[gameId]) {
    jobIds[gameId].forEach(item => {
      RNFS.stopDownload(item);
    });
  }
  jobIds[gameId] = [];

  return dispatch => {
    AsyncStorage.removeItem(gameId.toString());

    cancel &&
      dispatch(
        setGameToLocalStore({
          gameId,
          json: undefined,
          cancel: true
        })
      );

    cancel &&
      dispatch(
        setDownloadSuccess({
          persent: 0,
          gameId,
          tour: 1,
          persent1: 0,
          persent2: 0,
          persent3: 0
        })
      );
  };
};

export function setDownloadSuccess(data) {
  return {
    type: "SET_DOWNLOAD_SUCCESS",
    payload: data
  };
}

export function setGameToLocalStore(data) {
  return {
    type: "SET_GAME_TO_LOCAL_STORE",
    payload: data
  };
}

export default function setDownload(data) {
  return dispatch => {
    let tour = 1;
    jobIds[data.gameId] = [];
    number[data.gameId] = 0;
    persent1[data.gameId] = 0;
    persent2[data.gameId] = 0;
    persent3[data.gameId] = 0;

    dispatch(
      setDownloadSuccess({
        persent: 0.1,
        gameId: data.gameId,
        tour
      })
    );

    fetch("https://api.party.mozgo.com/game-content/" + data.item.hash, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + data.token
      }
    })
      .then(res => res.json())
      .then(async json => {
        dispatch(
          setGameToLocalStore({
            gameId: data.gameId,
            json: undefined,
            tour: 1,
            cancel: false
          })
        );

        let jsonString = JSON.stringify(json);

        const filesCount = jsonString.split("https://").length;

        const game = new Game(JSON.parse(jsonString));
        let dataScreen = game.initialScreen();

        while (dataScreen) {
          const promises = [];

          if (tour == 1) {
            promises.push(
              downloadGameBackground(
                jsonString,
                dispatch,
                data,
                filesCount,
                tour
              )
            );
            promises.push(
              blitzTimerMedia(jsonString, dispatch, data, filesCount, tour)
            );
          }

          while (dataScreen) {
            if (dataScreen.tour > tour) {
              tour = dataScreen.tour;
              console.log("TOUR", tour);
              break;
            }

            if (cancelDownloadVariable) {
              return;
            }

            promises.push(
              download(dataScreen, dispatch, tour, jsonString, filesCount, data)
            );

            dataScreen = game.nextScreen();
          }

          await Promise.all(promises);
        }

        await AsyncStorage.setItem(data.gameId, jsonString);
        dispatch(
          setGameToLocalStore({
            gameId: data.gameId,
            json: JSON.parse(jsonString),
            tour,
            cancel: false
          })
        );
      });
  };
}

const blitzTimerMedia = async (
  jsonString,
  dispatch,
  data,
  filesCount,
  tour
) => {
  const blitzTimerMediaFirstIndex = jsonString.indexOf("blitzTimerMedia");
  const blitzTimerMediaLinkFirstIndex = jsonString.indexOf(
    "https://",
    blitzTimerMediaFirstIndex
  );
  const blitzTimerMediaLinkLastIndex = jsonString.indexOf(
    '"',
    blitzTimerMediaLinkFirstIndex
  );
  const blitzTimerMediaUrl = jsonString.slice(
    blitzTimerMediaLinkFirstIndex,
    blitzTimerMediaLinkLastIndex
  );
  const splitBlitzTimerMediaUrl = blitzTimerMediaUrl.split("/");
  const blitzTimerMediaFileName =
    splitBlitzTimerMediaUrl[splitBlitzTimerMediaUrl.length - 1];
  const blitzTimerMediaDownload = RNFS.downloadFile({
    fromUrl: blitzTimerMediaUrl,
    toFile: RNFS.DocumentDirectoryPath + "/" + blitzTimerMediaFileName,
    begin: res => {
      jobIds[data.gameId].push(res.jobId);
      // console.log("begin1");
    },
    progress: res => {
      // console.log("progress1", res);
    }
  });
  const blitzTimerMediaResult = await blitzTimerMediaDownload.promise;
  if (cancelDownloadVariable) {
    return;
  }

  jsonString = jsonString.replace(
    blitzTimerMediaUrl,
    "file://" + RNFS.DocumentDirectoryPath + "/" + blitzTimerMediaFileName
  );

  number[data.gameId]++;

  dispatch(
    setDownloadSuccess({
      persent: (number[data.gameId] / filesCount) * 100,
      gameId: data.gameId,
      tour
    })
  );
};

const downloadGameBackground = async (
  jsonString,
  dispatch,
  data,
  filesCount,
  tour
) => {
  const gameBackgroundFirstIndex = jsonString.indexOf("gameBackground");
  const gameBackgroundLinkFirstIndex = jsonString.indexOf(
    "https://",
    gameBackgroundFirstIndex
  );
  const gameBackgroundLinkLastIndex = jsonString.indexOf(
    '"',
    gameBackgroundLinkFirstIndex
  );
  const gameBackgroundUrl = jsonString.slice(
    gameBackgroundLinkFirstIndex,
    gameBackgroundLinkLastIndex
  );
  const splitGameBackgroundUrl = gameBackgroundUrl.split("/");
  const gameBackgroundFileName =
    splitGameBackgroundUrl[splitGameBackgroundUrl.length - 1];
  const gameBackgroundDownload = RNFS.downloadFile({
    fromUrl: gameBackgroundUrl,
    toFile: RNFS.DocumentDirectoryPath + "/" + gameBackgroundFileName,
    begin: res => {
      jobIds[data.gameId].push(res.jobId);

      // console.log("begin3");
    },
    progress: res => {
      // console.log("progress3", res);
    }
  });
  const gameBackgroundResult = await gameBackgroundDownload.promise;
  if (cancelDownloadVariable) {
    return;
  }

  jsonString = jsonString.replace(
    gameBackgroundUrl,
    "file://" + RNFS.DocumentDirectoryPath + "/" + gameBackgroundFileName
  );

  number[data.gameId]++;

  dispatch(
    setDownloadSuccess({
      persent: (number[data.gameId] / filesCount) * 100,
      gameId: data.gameId,
      tour
    })
  );
};

const download = async (
  dataScreen,
  dispatch,
  tour,
  jsonString,
  filesCount,
  data
) => {
  let jsnStr = JSON.stringify(dataScreen);

  while (jsnStr.indexOf("https://") != -1) {
    if (cancelDownloadVariable) {
      return;
    }

    const firstIndexOfHttps = jsnStr.indexOf("https://");
    const lastLinkIndex = jsnStr.indexOf('"', firstIndexOfHttps);
    const url = jsnStr.slice(firstIndexOfHttps, lastLinkIndex);
    const splitUrl = url.split("/");
    const fileName = splitUrl[splitUrl.length - 1];

    const download = RNFS.downloadFile({
      fromUrl: url,
      toFile: RNFS.DocumentDirectoryPath + "/" + fileName,
      begin: res => {
        jobIds[data.gameId].push(res.jobId);

        // console.log("begin2", res.contentLength);
      },
      progress: res => {
        // console.log("progress2", res);
      }
    });
    const result = await download.promise;
    if (cancelDownloadVariable) {
      return;
    }

    jsonString = jsonString.replace(
      url,
      "file://" + RNFS.DocumentDirectoryPath + "/" + fileName
    );
    jsnStr = jsnStr.replace(
      url,
      "file://" + RNFS.DocumentDirectoryPath + "/" + fileName
    );

    number[data.gameId]++;

    if (persent1[data.gameId] == 0 && tour - 1 >= 1) {
      persent1[data.gameId] = (number[data.gameId] / filesCount) * 100;

      dispatch(
        setGameToLocalStore({
          gameId: data.gameId,
          json: JSON.parse(jsonString),
          tour,
          cancel: cancelDownloadVariable
        })
      );
    }

    if (persent2[data.gameId] == 0 && tour - 1 >= 2) {
      persent2[data.gameId] = (number[data.gameId] / filesCount) * 100;

      dispatch(
        setGameToLocalStore({
          gameId: data.gameId,
          json: JSON.parse(jsonString),
          tour,
          cancel: cancelDownloadVariable
        })
      );
    }

    if (persent3[data.gameId] == 0 && tour - 1 >= 3) {
      persent3[data.gameId] = (number[data.gameId] / filesCount) * 100;

      dispatch(
        setGameToLocalStore({
          gameId: data.gameId,
          json: JSON.parse(jsonString),
          tour,
          cancel: cancelDownloadVariable
        })
      );
    }

    dispatch(
      setDownloadSuccess({
        persent: (number[data.gameId] / filesCount) * 100,
        gameId: data.gameId,
        tour,
        persent1: persent1[data.gameId],
        persent2: persent2[data.gameId],
        persent3: persent3[data.gameId]
      })
    );
  }
};
