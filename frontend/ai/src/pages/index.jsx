import { useEffect, useRef, useState } from "react";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Select from "../components/Select.jsx";
import LoadingIcon from "../components/LoadingIcon.jsx";
import ImageListVideo from "../components/ImageListVideo.jsx";
import Panel from "../components/Panel.jsx";
import Tabs from "../components/Tabs.jsx";
import { web_url, socket_url, server, session } from "../helper/web_url.js";
import VideoWrapper from "../components/VideoWrapper.jsx";
import FullScreen from "../components/FullScreen";
import Questions from "../components/Questions.jsx";
import Lock from "../components/Lock.jsx";
import PageButton from "../components/PageButton.jsx";
import Info from "../components/Info.jsx";
import dynamic from "next/dynamic";

const SpeechToText = dynamic(() => import("../Library/SpeechToText"), {
  ssr: false,
});

// Fixed
import NavigationSidebar from "../components/NavigationSidebar.jsx";
import Logo from "../components/Logo.jsx";
import { FaBars } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import Toggle from "../components/Toggle.jsx";
import ImageSearchTab from "../components/ImageSearchTab.jsx";
import SettingsModal from "../components/SettingsModal.jsx";
import ChatBot from "../components/ChatBot.jsx";


let linksArray = [];
let currentK;
let autoFetchData;
const MAX_PAGE = 8;
const io = require("socket.io-client");
const socket = io(socket_url, {
  withCredentials: true,
  extraHeaders: {
    "ngrok-skip-browser-warning": "69420",
  },
});

function index() {
  // Fixed
  const [videoPerPage, setVideoPerPage] = useState(7);
  const [isSetting, setIsSetting] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeContent, setActiveContent] = useState("metadata");
  const [bgColor, setBgColor] = useState(false);

  const [videos, setVideos] = useState([]);
  const [id, setId] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clip, setClip] = useState(false);
  const [clipv2, setClipv2] = useState(true);
  const [recTags, setRecTags] = useState([]);
  const [fullScreenImg, setFullScreenImg] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);
  const [k, setK] = useState(500);
  const [selected, setSelected] = useState(queryHistory[0]);
  const [selectedFilter, setSelectedFilter] = useState({ name: "No Filter" });
  const [relatedObj, setRelatedObj] = useState({});
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [page, setPage] = useState(0);
  const [translate, setTranslate] = useState("");
  const [feedback, setFeedback] = useState({
    lst_pos_idxs: [],
    lst_neg_idxs: [],
  });
  const [questionName, setQuestionName] = useState("");
  const [username, setUsername] = useState("");
  const [lockUsernameInput, setLockUsernameInput] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [rangeFilter, SetRangeFilter] = useState(3);
  const [ignore, setIgnore] = useState(false);
  const [ignoredImages, setIgnoredImages] = useState([]);
  const [autoIgnore, setAutoIgnore] = useState(false);
  const [infoDialog, setInfoDialog] = useState({});
  const [isShown, setIsShown] = useState(false);
  const [searchSpace, setSearchSpace] = useState(0);

  // Fixed
  const toggleSetting = () => {
    setIsSetting(!isSetting);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleContentChange = (content) => {
    setActiveContent(content);
  };


  const fetchGetObj = {
    method: "get",
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  };

  // useEffect(() => {
  //  fetch(`${web_url}/data`, fetchGetObj)
  //   .then((data) => data.json())
  //   .then((res) => {
  //    handleData(res);
  //   })
  //   .catch((e) => console.log(`/data fecth error ${e}`));
  // }, []);

  const getOwnedQuestions = (username) => {
    setQuestionsLoading(true);
    fetch(`${socket_url}/getquestions`, {
      method: "post",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        username: username,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(JSON.stringify(res))
        // console.log(JSON.stringify(questions));
        console.log("set");
        setQuestions(res);
        setQuestionsLoading(false);
      })
      .catch((e) => console.log(e));
  };

  // const socketSubmit = (res) => {
  //     getOwnedQuestions(username);
  // };

  useEffect(() => {
    if (
      localStorage.getItem("username") === undefined
      // localStorage.getItem("username").length === 0
    ) {
      alert("Input username (only first time)");
      document.getElementById("username").focus();
    } else {
      setUsername(localStorage.getItem("username"));
      getOwnedQuestions(localStorage.getItem("username"));
    }

    // socket.on("submit", socketSubmit);

    return () => {
      // socket.removeAllListeners("submit");
    };
  }, []);

  const socketIgnore = (res) => {
    console.log("on 'ignore'");
    if (questionName === res.questionName) {
      setIgnoredImages(res.data);
    }
  };

  const handleSaveSettings = (newSettings) => {
    console.log("New settings: " + JSON.stringify(newSettings));

    setUsername(newSettings?.username ?? username);

    if (newSettings?.numberOfFrames && filter && newSettings?.numberOfFrames > currentK)
      alert(
        `Filter Mode: K must be smaller than in the previous query`
      );
    else {
      setK(newSettings?.numberOfFrames ?? k);
    };
    
    setClip(newSettings?.modelCLIPCheck ?? clip);
    setClipv2(newSettings?.modelCLIPV2Check ?? clipv2);
    SetRangeFilter(newSettings?.numberOfFilter ?? rangeFilter);
    setSelectedFilter({ name: newSettings?.selectedFilter ?? selectedFilter });
    
    if(newSettings?.numberOfVideosPerPage >= 1 && newSettings?.numberOfVideosPerPage <= 10) {
      setVideoPerPage(newSettings?.numberOfVideosPerPage ?? videoPerPage);
    } else {
      return window.alert("Number of videos per page must between 1 and 10, please try again!");
    }
    window.alert("Save settings successfully!");
  }

  useEffect(() => {
    // let delayInputUsername = setTimeout(() => {
    // Send Axios request here
    // }, 200);
    fetch(`${socket_url}/getignore`, {
      method: "post",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        questionName: questionName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIgnoredImages(data.data);
      })
      .catch((e) => console.log(e));

    socket.on("ignore", socketIgnore);

    return () => {
      socket.removeAllListeners("ignore");
    };
  }, [questionName]);

  const getIgnoredImages = (id) => {
    return ignoredImages.includes(id);
  };

  useEffect(() => {
    if (username !== "") getOwnedQuestions(username);
  }, [username]);

  //
  //SOCKET.IO
  //

  const handleTranslate = (text) => {
    fetch(`${web_url}/translate`, {
      method: "post",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        textquery: text,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTranslate(data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (query !== "") {
      document.getElementById("translate").style.display = "block";
      const mainsearch = document.getElementById("mainsearch");
      mainsearch.scrollLeft = mainsearch.scrollWidth
    }
    const transTime = setTimeout(() => {
      handleTranslate(query);
      // console.log(query);
    }, 350);
    return () => {
      clearTimeout(transTime);
    };
  }, [query]);

  const handleHistory = (id) => {
    setLoading(true);
    currentK = linksArray[id].k;
    setK(linksArray[id].k);
    handleData(linksArray[id].data);
    setLoading(false);
  };

  const handleData = (data) => {
    setPage(0);
    deleteFeedback();
    setVideos(data);
    let ids = [];
    data.forEach((element) => {
      ids = [...ids, ...element.video_info.lst_idxs];
    });
    setId(ids);
  };

  const getNewHistoryQueryId = (imgId = '') => {
    const rawQuery = queryHistory.filter(q => !q.metadataImgId);
    const newId = (imgId && imgId !== '') ? rawQuery.length : rawQuery.length + 1;
    return newId;
  }

  const textSearchFetch = (ignoreIndexes) => {
    let filtervideo =
      selectedFilter.name === "No Filter"
        ? 0
        : selectedFilter.name === "Filter Forwards"
          ? 1
          : 2;
    fetch(`${web_url}/textsearch`, {
      method: "post",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        textquery: query,
        filtervideo: filtervideo,
        clip: clip,
        clipv2: clipv2,
        filter: filter,
        id: id,
        k: k,
        videos: videos,
        range_filter: rangeFilter,
        ignore: ignore,
        ignore_idxs: ignoreIndexes,
        search_space: searchSpace,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        linksArray.push({
          data: data,
          k: k,
        });
        currentK = k;
        setSelected({
          id: getNewHistoryQueryId(),
          name: query,
        });
        handleData(data);
        setLoading(false);
      })
      .catch((e) => {
        alert("Textsearch Fetch Failed!" + e);
      });
  };

  const handleSaveQueryHistory = (imgId = '', icons = [], tags = []) => {
    const queryName = (imgId && imgId !== '') ? 'extra_' + query : query;
    const rawQuery = queryHistory.filter(q => !q.metadataImgId);
    const newId = (imgId && imgId !== '') ? rawQuery.length : rawQuery.length + 1;

    return setQueryHistory([
      ...queryHistory,
      {
        id: newId,
        name: queryName,
        metadataImgId: imgId,
        icons: icons,
        tags: tags
      },
    ]);

  }

  const getImgLinks = () => {
    let ignoreIndexes;
    setLoading(true);
    handleSaveQueryHistory();

    if (ignore) {
      fetch(`${socket_url}/getignore`, {
        method: "post",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          questionName: questionName,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          ignoreIndexes = data.data;
          textSearchFetch(ignoreIndexes);
        });
    } else textSearchFetch(ignoreIndexes);
  };

  const clearAll = () => {
    linksArray = [];
    deleteFeedback();
    setQueryHistory([]);
    setVideos([]);
    setId([]);
    setFilter(false);
    setSelectedFilter({ name: "No Filter" });
  };

  const getRec = () => {
    fetch(`${web_url}/getrec`, {
      method: "post",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(query),
    })
      .then((data) => data.json())
      .then((result) => setRecTags(result))
      .catch((e) => alert("getrec failed!" + e));
  };

  const handleKNN = (imgId) => {
    setLoading(true);
    fetch(`${web_url}/imgsearch?imgid=${imgId}&k=${k}`, fetchGetObj)
      .then((res) => res.json())
      .then((data) => {
        handleData(data);
        setLoading(false);

        // TODO: Query history saving here
        linksArray.push({
          data: data,
          k: k,
        });
        currentK = k;
        setSelected({
          id: getNewHistoryQueryId(imgId),
          name: 'extra_' + query,
        });
        handleSaveQueryHistory(imgId);
      })
      .catch((e) => console.log(`KNN Fetch Failed ${e}`));
  };

  const toggleFullScreen = (image) => {
    if (image !== null) {
      fetch(`${web_url}/relatedimg?imgid=${image.id}`, fetchGetObj)
        .then((res) => res.json())
        .then((data) => {
          setFullScreenImg(image);
          setRelatedObj(data);
        });
    } else setFullScreenImg(null);
  };

  const handleFeedback = (id, type) => {
    setFeedback((oldFeedback) => {
      if (type === "lst_pos_idxs") {
        let lst_pos_idxs;
        if (!oldFeedback.lst_pos_idxs.includes(id)) {
          lst_pos_idxs = [...oldFeedback.lst_pos_idxs, id];
        } else
          lst_pos_idxs = oldFeedback.lst_pos_idxs.filter((item) => item !== id);
        return {
          ...oldFeedback,
          lst_pos_idxs: lst_pos_idxs,
        };
      } else if (type === "lst_neg_idxs") {
        let lst_neg_idxs;
        if (!oldFeedback.lst_neg_idxs.includes(id)) {
          lst_neg_idxs = [...oldFeedback.lst_neg_idxs, id];
        } else
          lst_neg_idxs = oldFeedback.lst_neg_idxs.filter((item) => item !== id);
        return {
          ...oldFeedback,
          lst_neg_idxs: lst_neg_idxs,
        };
      }
    });
  };

  const deleteFeedback = () => {
    setFeedback({
      lst_neg_idxs: [],
      lst_pos_idxs: [],
    });
  };

  const sendFeedback = () => {
    if (
      feedback.lst_neg_idxs.length === 0 &&
      feedback.lst_pos_idxs.length === 0
    ) {
      alert("Feedback first");
      return;
    }
    setLoading(true);
    fetch(`${web_url}/feedback`, {
      method: "post",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        lst_neg_idxs: feedback.lst_neg_idxs,
        lst_pos_idxs: feedback.lst_pos_idxs,
        k: k,
        videos: videos,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        handleData(data);
        setLoading(false);
      });
  };

  const getImgFeedback = (id) => {
    let imgFeedback;
    if (feedback.lst_pos_idxs.includes(id)) imgFeedback = "like";
    else if (feedback.lst_neg_idxs.includes(id)) imgFeedback = "dislike";
    return imgFeedback;
  };

  const addView = (id) => {
    if (questionName === "") {
      alert("Choose question first");
    } else {
      socket.emit("submit", {
        questionName: questionName,
        idx: id,
        user: username,
      });

    }
  };

  const handleSelect = (id, video) => {
    if (window.confirm(`Do you want to submit id ${id} in video ${video}?`)) {
      fetch(`${server}?item=${video}&frame=${id}&session=${session}`)
        .then((res) => res.json())
        .then((res) => {
          alert(`Description: ${res.description}. Status: ${res.status}`);
        })
        .catch((e) => alert(e));
    }
  };

  const handleUsername = (name) => {
    localStorage.setItem("username", name);
    setUsername(name);
  };

  const handleIgnore = (lst_idxs) => {
    if (questionName === "") alert("Choose question first");
    else {
      socket.emit("ignore", {
        questionName: questionName,
        idx: lst_idxs,
        autoIgnore: false,
      });
    }
  };

  const handleAutoIgnore = (page, isAutoFetched = false) => {
    console.log("isAutofetch: ", isAutoFetched);
    if (questionName === "") {
      alert("Type question first");
      return false;
    } else {
      let lst_video;
      if (isAutoFetched) {
        lst_video =
          (+(videos.length / videoPerPage) > MAX_PAGE)
            ? videos.slice((Math.floor(videos.length / videoPerPage) - MAX_PAGE) * videoPerPage)
            : videos;
      } else {
        lst_video = videos.slice(
          page * videoPerPage,
          page * videoPerPage + videoPerPage
        );
      }
      let lst_idxs = [];
      lst_video.forEach((video) => {
        if ("video_info_prev" in video) {
          lst_idxs.push(...video.video_info_prev.lst_idxs);
        }
        lst_idxs.push(...video.video_info.lst_idxs);
      });
      // Remember to alert when user forgets to set questions
      // Add autoIgnore in storage
      socket.emit("ignore", {
        questionName: questionName,
        idx: lst_idxs,
        autoIgnore: true,
      });
      return lst_idxs;
    }
  };

  const autoFetch = () => {
    let lst_idxs = handleAutoIgnore(page, true);
    console.log("lstidx ", lst_idxs);
    if (!lst_idxs) {
      return;
    } else {
      console.log(lst_idxs);
      showDialog("success", "Auto Fetching...");
      fetch(`${socket_url}/getignore`, {
        method: "post",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          questionName: questionName,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          let ignoreIndexes = data.data;
          console.log("...lst_idxs", ...lst_idxs);
          ignoreIndexes.push(...lst_idxs);
          console.log(ignoreIndexes);

          let filtervideo =
            selectedFilter.name === "No Filter"
              ? 0
              : selectedFilter.name === "Filter Forwards"
                ? 1
                : 2;
          fetch(`${web_url}/textsearch`, {
            method: "post",
            headers: new Headers({
              "ngrok-skip-browser-warning": "69420",
              "Content-Type": "application/json",
            }),
            body: JSON.stringify({
              textquery: query,
              filtervideo: filtervideo,
              clip: clip,
              clipv2: clipv2,
              filter: filter,
              id: id,
              k: k,
              videos: videos,
              range_filter: rangeFilter,
              ignore: ignore,
              ignore_idxs: ignoreIndexes,
              search_space: searchSpace,
            }),
          })
            .then((data) => data.json())
            .then((data) => {
              showDialog("success", "Auto Fetched!");
              handleSaveQueryHistory();
              linksArray.push({
                data: data,
                k: k,
              });
              currentK = k;

              autoFetchData = data;
            });
        })
        .catch((e) => {
          alert("Auto Fetch Failed!" + e);
        });
    }
  };

  const showDialog = (type, message) => {
    setInfoDialog({ type: type, message: message });
    setIsShown(true);
  };

  const showAutoFetch = () => {
    if (autoFetchData !== undefined) {
      setSelected({
        id: getNewHistoryQueryId() - 1,
        name: query,
      });
      handleData(autoFetchData);
      autoFetchData = undefined;
    } else {
      showDialog(
        "failure",
        "Fetch hasn't finished! Please wait or manually search!"
      );
    }
  };

  const checkFilter = () => {
    if (filter || (videos.length > 0 && "video_info_prev" in videos[0])) {
      return true;
    }
    return false;
  };

  return (
    <div
      style={{
        backgroundImage: bgColor ? 'none' : 'url("/background.jpg")',
        width: '100%',
        height: '100vh', // Ensure the background covers the full viewport height
        backgroundSize: 'cover', // Ensure the background image covers the entire div
        backgroundRepeat: 'no-repeat', // Prevent the background image from repeating
        backgroundPosition: 'center', // Center the background image
      }}
      className="flex h-screen w-screen"
      onClick={(e) => {
        const translateElement = document.getElementById("translate");
        const questionsElement = document.getElementById("questions");

        if (translateElement) {
          translateElement.style.display = "none";
        }

        if (questionsElement) {
          questionsElement.style.display = "none";
        }
      }}
    >
      {/* {full screen img} */}

      <FullScreen
        fullScreenImg={fullScreenImg}
        setFullScreenImg={setFullScreenImg}
        relatedObj={relatedObj}
      />
      {Object.keys(infoDialog).length !== 0 && isShown && (
        <Info
          type={infoDialog.type}
          message={infoDialog.message}
          setIsShown={setIsShown}
        />
      )}

      {/*toggle Sidebar*/}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-300 rounded-md hover:bg-gray-400"
      >
        <FaBars size={24} />
      </button>

      {isSidebarOpen && (
        <NavigationSidebar
          activeContent={activeContent}
          handleContentChange={handleContentChange}
        />
      )}


      <div className={`flex-grow p-6 mt-4 transition-all duration-300 ${isSidebarOpen ? 'ml-44' : 'ml-8'} ${activeContent === 'history' ? 'mr-32' : ''}`}>
        {activeContent === "metadata" &&
          <>
            {/* <Logo/> */}
            <Panel
              socket={socket}
              id={id}
              handleKNN={handleKNN}
              recTags={recTags}
              getRec={getRec}
              setRecTags={setRecTags}
              toggleFullScreen={toggleFullScreen}
              handleSelect={handleSelect}
              handleIgnore={handleIgnore}
              ignore={ignore}
              questionName={questionName}
              ignoredImages={ignoredImages}
              getIgnoredImages={getIgnoredImages}
              autoIgnore={autoIgnore}
              searchSpace={searchSpace}
              addView={addView}
              bgColor={bgColor}
              VIDEO_PER_PAGE={videoPerPage}
            />
          </>
        }
        {activeContent === "image" &&
          // <div className="text-black">Image Search Content</div>
          <ImageSearchTab
            socket={socket}
            handleKNN={handleKNN}
            toggleFullScreen={toggleFullScreen}
            handleSelect={handleSelect}
            handleIgnore={handleIgnore}
            questionName={questionName}
            getIgnoredImages={getIgnoredImages}
            autoIgnore={autoIgnore}
            addView={addView}
            VIDEO_PER_PAGE={videoPerPage}
          />
        }
        {activeContent === "chatbot" && <>
          <ChatBot
            setQuery={setQuery}
          />
          </>}
        {activeContent === "history" && <>
          <div>
            {/* <Logo/> */}
            <Tabs
              queryHistory={queryHistory}
              handleHistory={handleHistory}
              selected={selected}
              setSelected={setSelected}
            />
          </div>
        </>}
        {activeContent === "submit" &&
          <a href="/submit" target="_blank" className="h-8 w-12 rounded-md">
            Submit
          </a>
          }
      </div>

      <div className="flex-auto relative h-full flex flex-col overflow-auto">
        {/* {loading icon} */}
        {loading && <LoadingIcon />}
        {/* {searchbars} */}
        <div className="y h-fit w-full  container mt-1 p-1">
          <div id="bar" className=" main-search flex relative gap-1">
            {
              // translate &&
              <span
                id="translate"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(translate);
                  document.getElementById("mainsearch").focus();
                }}
                style={{ zIndex: 2, display: "none" }}
                className="  hover:ring-2 ring-orange-400 transition-all cursor-pointer align-middle h-fit absolute top-11 placeholder:italic text-slate-300  w-full p-1 indent-1 rounded-md bg-slate-800"
              >
                {translate ? translate : "Translate..."}
              </span>
            }
            <input
              id="mainsearch"
              tabIndex={1}
              autoFocus={true}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  document.getElementById("mainsearch_button").click();
                }
              }}
              type="search"
              placeholder="Text query"
              className="  transition-all hover:drop-shadow-[0px_4px_3px_rgba(255,255,255,0.2)] placeholder:italic text-slate-800 font-bold relative w-full indent-3 rounded-full bg-slate-200"
              onClick={(e) => e.stopPropagation()}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                // handleTranslate(e.target.value);
                document.getElementById("translate").style.display = "block";
              }}
              onFocus={(e) => {
                document.getElementById("translate").style.display = "block";
              }}
            ></input>
            <div className=" mr-2 w-20 h-10 gap-1 flex space-around items-center">
              <button
                type="button"
                id="mainsearch_button"
                className="border-orange-400 focus:bg-gradient-to-tr hover:opacity-100 border hover:bg-gradient-to-tr from-orange-400 via-red-500 to-red-400 duration-75  hover:scale-90  p-1 bg-slate-100 rounded-full"
                onClick={() => {
                  getImgLinks();
                  getRec();
                }}
              >
                <AiOutlineSearch color={"black"} fontSize="1.5rem" />
              </button>
              <SpeechToText setQuery={setQuery} />
              {/*toggle Setting*/}

            </div>

            {/* ADD SETTING MODELS HERE */}
            {/* <button
              onClick={toggleSetting}
              className="mr-4 z-50 p-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              <IoIosSettings size={24} />
            </button> */}

            <SettingsModal usernameIndex={username} bgColor={bgColor} setBgColor={setBgColor} handleSave={handleSaveSettings}/>




          </div>

          <div id="Number of frame" hidden={true}>
                <label
                  htmlFor="Number of frame: "
                  className="cursor-pointer pl-0.5 text-slate-500 text-lg mr-4"
                >
                  <span className="">Number of frame: </span>
                </label>
                <input
                  tabIndex={-1}
                  id="K"
                  type="number"
                  placeholder="K"
                  className="w-12 h-8 indent-2 transition-all hover:drop-shadow-[0px_4px_3px_rgba(255,255,255,0.2)] placeholder:italic text-black font-bold indent-0.5 relative rounded-md bg-slate-200"
                  onChange={(e) => {
                    if (filter && e.target.value > currentK)
                      alert(
                        `Filter Mode: K must be smaller than in the previous query`
                      );
                    else setK(e.target.value);
                  }}
                  value={k}
                ></input>
              </div>
          {isSetting && <div className="checkboxes grid grid-cols-12 w-full h-fit">
            {/* <Tabs
              queryHistory={queryHistory}
              handleHistory={handleHistory}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <Select selected={selectedFilter} setSelected={setSelectedFilter} />
            <input
              tabIndex={-1}
              id="rangeFilter"
              type="number"
              placeholder="range"
              className="w-10 h-9 indent-2 appearance-none transition-all hover:drop-shadow-[0px_4px_3px_rgba(255,255,255,0.2)] placeholder:italic text-slate-800 text-lg relative p-0.5 rounded-md bg-slate-200"
              onChange={(e) => {
                SetRangeFilter(e.target.value);
              }}
              value={rangeFilter}
            ></input> */}
            {isSetting && <div className="col-span-5 y grid grid-cols-5 h-fit w-full container mt-1 p-1">
              
              {/* <div id="Model Type" className="flex items-center ">
                <label
                  htmlFor="Model"
                  className="cursor-pointer ml-12 pl-0.5 text-slate-500"
                >
                  <span className="text-lg">Model: </span>
                </label>
                <div id="clip" className="flex ml-4 items-center ">
                  <input
                    checked={clip}
                    onChange={(e) => {
                      setClip(e.target.checked);
                    }}
                    id="Clip"
                    type="checkbox"
                    className="cursor-pointer rounded-md  duration-200 w-5 h-5 accent-slate-600 bg-gray-100 border-gray-300 rounded hover:ring-slate-500 hover:ring-2"
                  />
                  <label
                    htmlFor="Clip"
                    className="cursor-pointer pl-0.5 text-slate-500 text-lg"
                  >
                    <span className="">CLIP</span>
                  </label>
                </div>
              </div>
              <div
                id="clipv2"
                className="flex items-center ml-4 rounded-md"
              >
                <input
                  checked={clipv2}
                  onChange={(e) => {
                    setClipv2(e.target.checked);
                  }}
                  id="Clipv2"
                  type="checkbox"
                  className="cursor-pointer rounded-md duration-200 w-5 h-5 accent-orange-700/75 text-red-500 rounded hover:ring-orange-300 hover:ring-2"
                />
                <label
                  htmlFor="Clipv2"
                  className="cursor-pointer pl-0.5 text-slate-500 text-lg"
                >
                  <span>CLIPv2</span>
                </label>
              </div> */}
              <div className="col-span-2 px-1 relative">
                <input
                  tabIndex={1}
                  id="username"
                  value={username}
                  autoComplete="off"
                  // disabled={lockUsernameInput}
                  readOnly={lockUsernameInput}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      document.getElementById("lock").click();
                    }
                  }}
                  type="search"
                  placeholder="Username..."
                  className={`w-full h-10 transition-all  
                placeholder:italic text-slate-500 font-bold relative indent-1 rounded-full 
                ${lockUsernameInput
                      ? "bg-slate-300 border border-white/50 outline-none cursor-no-drop"
                      : "bg-slate-800"
                    }
                `}
                  onChange={(e) => {
                    handleUsername(e.target.value);
                  }}
                />
                <Lock lock={lockUsernameInput} setLock={setLockUsernameInput} />
              </div>
              <div className="col-span-3 px-1 h-fit w-full flex flex-col relative">
                <input
                  placeholder="Questions"
                  id="questionName"
                  value={questionName}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      if (questionName === "") {
                        alert("Type question first");
                      }
                      if (document.getElementById("send")) {
                        document.getElementById("send").click();
                      }
                    }
                  }}
                  onChange={(e) => {
                    setQuestionName(e.target.value);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    getOwnedQuestions(username);
                    document.getElementById("questions").style.display = "flex";
                    console.log("click");
                  }}
                  onFocus={() => {
                    document.getElementById("questions").style.display = "flex";
                  }}
                  className="transition-all hover:drop-shadow-[0px_2px_1px_rgba(255,255,255,0.2)] placeholder:italic text-slate-500 text-lg relative w-full p-1 indent-1 rounded-full bg-slate-200"
                />
                <Questions
                  isLoading={questionsLoading}
                  questions={questions}
                  username={username}
                  setQuestionName={setQuestionName}
                />
              </div>
            </div>}

            <div className="flex items-center col-span-4">
              <div id="filter" className="flex items-center ">
                <input
                  checked={filter}
                  onChange={(e) => {
                    setFilter(e.target.checked);
                  }}
                  disabled={queryHistory.length === 0 && filter === false}
                  id="Filter"
                  type="checkbox"
                  className="cursor-pointer rounded-md duration-200 ml-2 w-5 h-5 accent-slate-600 bg-gray-200 border-gray-400 rounded hover:ring-slate-500 hover:ring-2"
                />
                <label
                  htmlFor="Filter"
                  className="cursor-pointer pl-0.5 text-slate-500 text-lg"
                >
                  <span className="">Filter</span>
                </label>
              </div>
              <div id="ignore" className="flex ml-4 items-center ">
                <input
                  checked={ignore}
                  onChange={(e) => {
                    setIgnore(e.target.checked);
                  }}
                  id="Ignore"
                  type="checkbox"
                  className="cursor-pointer rounded-md duration-200 w-5 h-5 accent-slate-600 bg-gray-100 border-gray-300 rounded hover:ring-slate-500 hover:ring-2"
                />
                <label
                  htmlFor="Ignore"
                  className="cursor-pointer pl-0.5 text-slate-500 text-lg"
                >
                  <span className="">Ignore</span>
                </label>
              </div>
              <div id="Auto" className="flex ml-4 items-center">
                <input
                  checked={autoIgnore}
                  onChange={(e) => {
                    setAutoIgnore(e.target.checked);
                  }}
                  id="AutoIgnore"
                  type="checkbox"
                  className="cursor-pointer rounded-md duration-200 w-5 h-5 accent-slate-600 bg-gray-100 border-gray-300 rounded hover:ring-slate-500 hover:ring-2"
                />
                <label
                  htmlFor="AutoIgnore"
                  className="cursor-pointer pl-0.5 text-slate-500 text-lg"
                >
                  <span className="">Auto Ignore</span>
                </label>
              </div>
            </div>

            

            <div className="col-span-3 flex items-center w-full mr-8">
              <button id="Clear-results-button"
                onClick={() => {
                  clearAll();
                }}
                type="button"
                className="w-24 h-9 text-black font-bold rounded-md bg-slate-300 hover:bg-orange-600 hover:ring-2 ring-orange-400 transition hover:scale-90"
              >
                Clear
              </button>

              <div className="flex items-center ml-auto feedbackmode text-orange-500 rounded-md">
                <input
                  checked={feedbackMode}
                  onChange={(e) => {
                    deleteFeedback();
                    setFeedbackMode(e.target.checked);
                  }}
                  id="Feedback"
                  type="checkbox"
                  className="cursor-pointer rounded-md  duration-200 w-5 h-5 accent-orange-700/75 rounded hover:ring-orange-300 hover:ring-2"
                />
                <label
                  htmlFor="Feedback"
                  className="cursor-pointer pl-0.5 text-slate-300"
                >
                  <span className=" text-orange-400">Feedback</span>
                </label>
              </div>
              <button id="Send-feedback-button"
                onClick={() => {
                  sendFeedback();
                }}
                type="button"
                title="Send feedback"
                className="text-center items-center px-1 h-8 mx-2 rounded-md bg-slate-400 hover:bg-orange-600 hover:ring-2 ring-orange-400 transition hover:scale-90"
              >
                Send
              </button>
            </div>
            
            {/* <Toggle bgColor={bgColor} setBgColor={setBgColor}></Toggle> */}
          </div>}
        </div>


        {/* {images} */}
        <div
          id="images"
          className=" flex-auto flex-col overflow-auto flex h-full"
        >
          {!loading &&
            videos.length > 0 &&
            videos
              .slice(
                page * videoPerPage,
                parseInt(page * videoPerPage) + parseInt(videoPerPage)
              )
              .map((video, indexVideo) => {
                //  console.log("video: ", video);
                const video_info = video.video_info;
                // const currentVideos = (
                //   <VideoWrapper
                //     id={video.video_id}
                //     handleIgnore={() => handleIgnore(video_info.lst_idxs)}
                //   >
                //     {video_info.lst_keyframe_paths.map((path, index) => {
                //       let id = video_info.lst_idxs[index];
                //       return (
                //         <ImageListVideo
                //           imagepath={path}
                //           id={id}
                //           id_show={video_info.lst_keyframe_idxs[index]}
                //           handleKNN={handleKNN}
                //           handleSelect={handleSelect}
                //           feedbackMode={feedbackMode}
                //           handleFeedback={handleFeedback}
                //           handleIgnore={handleIgnore}
                //           imgFeedback={getImgFeedback(id)}
                //           toggleFullScreen={() =>
                //             toggleFullScreen({
                //               imgpath: path,
                //               id: id,
                //             })
                //           }
                //         />
                //       );
                //     })}
                //   </VideoWrapper>
                // );
                return "video_info_prev" in video ? (
                  <>
                    <VideoWrapper
                      filterFB={true}
                      id={video.video_id}
                      handleIgnore={() => handleIgnore(video_info.lst_idxs)}
                    >
                      {video_info.lst_keyframe_paths.map((path, index) => {
                        let id = video_info.lst_idxs[index];
                        return (
                          <ImageListVideo
                            addView={addView}
                            imagepath={path}
                            questionName={questionName}
                            id={id}
                            id_show={video_info.lst_keyframe_idxs[index]}
                            handleKNN={handleKNN}
                            handleSelect={() =>
                              handleSelect(
                                video_info.lst_keyframe_idxs[index],
                                video.video_id
                              )
                            }
                            feedbackMode={feedbackMode}
                            handleFeedback={handleFeedback}
                            handleIgnore={handleIgnore}
                            imgFeedback={getImgFeedback(id)}
                            isIgnored={getIgnoredImages(id)}
                            toggleFullScreen={() =>
                              toggleFullScreen({ imgpath: path, id: id })
                            }
                          />
                        );
                      })}
                    </VideoWrapper>
                    <VideoWrapper
                      filterFB={true}
                      id={`${video.video_id} PREV`}
                      handleIgnore={() =>
                        handleIgnore(video.video_info_prev.lst_idxs)
                      }
                    // isIgnored={getIsIgnored(indexVideo)}
                    >
                      {
                        video.video_info_prev.lst_keyframe_paths.map(
                          (path, index) => {
                            let id = video.video_info_prev.lst_idxs[index];
                            return (
                              <ImageListVideo
                                addView={addView}
                                imagepath={path}
                                questionName={questionName}
                                id={id}
                                id_show={
                                  video.video_info_prev.lst_keyframe_idxs[index]
                                }
                                handleKNN={handleKNN}
                                feedbackMode={false}
                                handleFeedback={handleFeedback}
                                handleSelect={() =>
                                  handleSelect(
                                    video.video_info_prev.lst_keyframe_idxs[
                                    index
                                    ],
                                    video.video_id
                                  )
                                }
                                isIgnored={getIgnoredImages(id)}
                                handleIgnore={handleIgnore}
                                imgFeedback={""}
                                toggleFullScreen={() =>
                                  toggleFullScreen({
                                    imgpath: path,
                                    id: id,
                                  })
                                }
                              />
                            );
                          }
                        )}
                    </VideoWrapper>
                    <hr className="h-2 border-1 my-8 bg-orange-400 border-slate-700"></hr>
                  </>
                ) : (
                  <>
                    <VideoWrapper
                      id={video.video_id}
                      handleIgnore={() => handleIgnore(video_info.lst_idxs)}
                    >
                      {video_info.lst_keyframe_paths.map((path, index) => {
                        let id = video_info.lst_idxs[index];
                        return (
                          <ImageListVideo
                            addView={addView}
                            imagepath={path}
                            questionName={questionName}
                            id={id}
                            id_show={video_info.lst_keyframe_idxs[index]}
                            handleKNN={handleKNN}
                            handleSelect={() =>
                              handleSelect(
                                video_info.lst_keyframe_idxs[index],
                                video.video_id
                              )
                            }
                            feedbackMode={feedbackMode}
                            handleFeedback={handleFeedback}
                            isIgnored={getIgnoredImages(id)}
                            handleIgnore={handleIgnore}
                            imgFeedback={getImgFeedback(id)}
                            toggleFullScreen={() =>
                              toggleFullScreen({
                                imgpath: path,
                                id: id,
                              })
                            }
                          />
                        );
                      })}
                    </VideoWrapper>
                    <hr className="border-1 my-6 bg-orange-400 border-slate-700"></hr>
                  </>
                );
              })}
        </div>
        {/* buttons */}
        {videos.length > 0 && !loading && (
          <PageButton
            totalPage={Math.floor(videos.length / videoPerPage)}
            autoFetch={autoFetch}
            isFilter={checkFilter()}
            showAutoFetch={showAutoFetch}
            page={page}
            setPage={setPage}
            autoIgnore={autoIgnore}
            handleAutoIgnore={handleAutoIgnore}
            DivID={"images"}
          />
        )}
      </div>
    </div>
  );
}

export default index;
