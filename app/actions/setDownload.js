import AsyncStorage from "@react-native-community/async-storage";
import Game from "../screens/Shop/Game";

var RNFS = require("react-native-fs");

let cancelDownloadVariable = false;

export const setCancelDownloadVariable = (cancel, gameId) => {
  cancelDownloadVariable = cancel;

  return dispatch => {
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
        let number = 0;

        const filesCount = jsonString.split("https://").length;

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
          toFile: RNFS.DocumentDirectoryPath + "/" + gameBackgroundFileName
        });
        const gameBackgroundResult = await gameBackgroundDownload.promise;
        jsonString = jsonString.replace(
          gameBackgroundUrl,
          "file://" + RNFS.DocumentDirectoryPath + "/" + gameBackgroundFileName
        );

        number++;

        dispatch(
          setDownloadSuccess({
            persent: (number / filesCount) * 100,
            gameId: data.gameId,
            tour
          })
        );

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
          toFile: RNFS.DocumentDirectoryPath + "/" + blitzTimerMediaFileName
        });
        const blitzTimerMediaResult = await blitzTimerMediaDownload.promise;
        jsonString = jsonString.replace(
          blitzTimerMediaUrl,
          "file://" + RNFS.DocumentDirectoryPath + "/" + blitzTimerMediaFileName
        );

        number++;

        dispatch(
          setDownloadSuccess({
            persent: (number / filesCount) * 100,
            gameId: data.gameId,
            tour
          })
        );

        const game = new Game(JSON.parse(jsonString));
        let dataScreen = game.initialScreen();

        let persent1 = 0;
        let persent2 = 0;
        let persent3 = 0;

        while (dataScreen) {
          let jsnStr = JSON.stringify(dataScreen);
          if (dataScreen.tour > tour) {
            tour = dataScreen.tour;
          }

          while (jsnStr.indexOf("https://") != -1) {
            if (cancelDownloadVariable) {
              // dispatch(
              //   setGameToLocalStore({
              //     gameId: data.gameId,
              //     json: undefined,
              //     tour,
              //     cancel: true
              //   })
              // );

              // dispatch(
              //   setDownloadSuccess({
              //     persent: 0,
              //     gameId: data.gameId,
              //     tour: 1,
              //     persent1: 0,
              //     persent2: 0,
              //     persent3: 0
              //   })
              // );
              return;
            }

            const firstIndexOfHttps = jsnStr.indexOf("https://");
            const lastLinkIndex = jsnStr.indexOf('"', firstIndexOfHttps);
            const url = jsnStr.slice(firstIndexOfHttps, lastLinkIndex);
            const splitUrl = url.split("/");
            const fileName = splitUrl[splitUrl.length - 1];
            console.log(firstIndexOfHttps, lastLinkIndex, url, fileName);

            const download = RNFS.downloadFile({
              fromUrl: url,
              toFile: RNFS.DocumentDirectoryPath + "/" + fileName
            });
            const result = await download.promise;

            jsonString = jsonString.replace(
              url,
              "file://" + RNFS.DocumentDirectoryPath + "/" + fileName
            );
            jsnStr = jsnStr.replace(
              url,
              "file://" + RNFS.DocumentDirectoryPath + "/" + fileName
            );

            number++;

            if (persent1 == 0 && tour - 1 >= 1) {
              persent1 = (number / filesCount) * 100;

              dispatch(
                setGameToLocalStore({
                  gameId: data.gameId,
                  json: JSON.parse(jsonString),
                  tour,
                  cancel: false
                })
              );
            }

            if (persent2 == 0 && tour - 1 >= 2) {
              persent2 = (number / filesCount) * 100;

              dispatch(
                setGameToLocalStore({
                  gameId: data.gameId,
                  json: JSON.parse(jsonString),
                  tour,
                  cancel: false
                })
              );
            }

            if (persent3 == 0 && tour - 1 >= 3) {
              persent3 = (number / filesCount) * 100;

              dispatch(
                setGameToLocalStore({
                  gameId: data.gameId,
                  json: JSON.parse(jsonString),
                  tour,
                  cancel: false
                })
              );
            }

            dispatch(
              setDownloadSuccess({
                persent: (number / filesCount) * 100,
                gameId: data.gameId,
                tour,
                persent1,
                persent2,
                persent3
              })
            );
          }

          dataScreen = game.nextScreen();
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
