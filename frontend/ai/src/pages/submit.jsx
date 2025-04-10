import { useEffect, useState } from "react";
import React from "react";
import { socket_url, web_url, server, session } from "../helper/web_url";
import ImageListSubmit from "../components/ImageListSubmit";
import LoadingIcon from "../components/LoadingIcon";
import Info from "../components/Info";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from "react-grid-dnd";
import FullScreen from "../components/FullScreen";
import Questions from "../components/Questions";
import Lock from "../components/Lock";
import download from "../helper/download";
import Switch from "../components/Switch";

const io = require("socket.io-client");
const socket = io(socket_url, {
  withCredentials: true,
  extraHeaders: {
    "ngrok-skip-browser-warning": "69420",
  },
});
function submit() {
  const [QvsA, setQvsA] = useState(false);
  const [QvsAData, setQvsAData] = useState("");
  const [questionName, setQuestionName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [lockUsernameInput, setLockUsernameInput] = useState(true);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fullScreenImg, setFullScreenImg] = useState(null);
  const [relatedObj, setRelatedObj] = useState({});
  const [admin, setAdmin] = useState(false);
  const [activeReorder, setActiveReorder] = useState(false);
  const [infoDialog, setInfoDialog] = useState({});
  const [isShown, setIsShown] = useState(false);

  // const [testList, setTestList] = useState([
  //   { path: "/tree.jpg", id: 0 },
  //   { path: "/tree.jpg", id: 2 },
  //   { path: "/tree.jpg", id: 3 },
  //   { path: "/tree.jpg", id: 4 },
  //   { path: "/tree.jpg", id: 5 },
  //   { path: "/tree.jpg", id: 6 },
  //   { path: "/tree.jpg", id: 7 },
  //   { path: "/shoes.jpg", id: 8 },
  //   { path: "/tree.jpg", id: 9 },
  //   { path: "/tree.jpg", id: 10 },
  //   { path: "/tree.jpg", id: 11 },
  //   { path: "/tree.jpg", id: 12 },
  // ]);

  // Download Body (QA) with json format
  {/*
    {
      "answerSets":[{
        "answers":[
        {
          "text": "ANSWER-VIDEO_ID-TIME",
        }]
      }]
    }
  */}

  const download_QA = (questionName, answer, video_id, time) => {
    const data = {
      "answerSets": video_id.map((id, index) => ({
      "answers": [
        {
        "text": `${answer}-${id}-${time[index]}`
        }
      ]
      }))
    };

    const fileName = `${questionName}_QA.json`;
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
 

  // Download Body (KIS) with json format
  {/*
    {
      "answerSets":[{
        "answers":[
        {
          "mediaItemName": "VIDEO_ID",
          "start": TIME,
          "end": TIME
        },
        {
          "mediaItemName": "VIDEO_ID",
          "start": TIME,
          "end": TIME
        },
        ]
      }]
    }
  */}
  //help me write a function to download KIS with json format with above format, this function use params video_id, start, end and download with json file format and this is the only function of it
  const download_KIS = (questionName, video_id, start, end) => {
    const data = {
      "answerSets": video_id.map((id, index) => ({
      "answers": [
        {
        "mediaItemName": id,
        "start": start[index],
        "end": end[index]
        }
      ]
      }))
    };

    const fileName = `${questionName}_KIS.json`;
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  const fetchGetObj = {
    method: "get",
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  };

  const handleQvsA = () => {
    setQvsA(!QvsA);
  };

  const handleQvsAData = (data) => {
    setQvsAData(data);
  };

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
        console.log("GET QUESTIONS DATA: ");
        console.log(JSON.stringify(res));
        console.log(JSON.stringify(questions));
        // if (JSON.stringify(res) !== JSON.stringify(questions)) {
        console.log("set");
        setQuestions(res);
        // }
        setQuestionsLoading(false);
      })
      .catch((e) => console.log(e));
  };

  // const socketSubmit = (res) => {
  //   getOwnedQuestions(username);
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

  useEffect(() => {
    if (username !== "") getOwnedQuestions(username);
  }, [username]);

  /* 
  SOCKET.ON
  */

  const socketViewsubmitted = (res) => {
    console.log("Have called socketViewsubmitted! Data: ");
    console.log(res);
    console.log("Questionname: " + questionName);
    if (Object.keys(res).length !== 0 && res.questionName == questionName) {
      setData(res);
    }
    setLoading(false);
  };

  const socketDelete = (res) => {
    if (res.questionName === data.questionName) {
      setData(res);
    }
  };

  useEffect(() => {
    console.log("CALL USE EFFECT 1");
    socket.on("submit", (res) => {
      console.log("Someone submitted to this question");
      if (res.questionName === data.questionName) {
        setData(res);
      }
    });
    console.log("CALL USE EFFECT 2");

    socket.on("viewsubmitted", socketViewsubmitted);
    socket.on("clearsubmit", socketDelete);

    return () => {
      socket.removeAllListeners("submit");
      socket.removeAllListeners("clearsubmit");
      socket.removeAllListeners("viewsubmitted");
    };
  }, [socket, data, questionName]);

  const socketActiveReorder = (status) => {
    console.log("function activere");
    if (status.user === username && status.ques_name === data.questionName) {
      if (status.is_accepted) {
        setActiveReorder(true);
        showDialog("success", "Reorder activated successfully!");
      } else {
        showDialog("failure", "Reorder activated unsuccessfully!");
        // console.log("This question is being reordered by a different user.");
      }
    }
  };

  const socketReorder = (res) => {
    console.log("new re");
    if (res.questionName === data.questionName) {
      if (JSON.stringify(res) !== JSON.stringify(data)) {
        console.log("not equal");
        setData(res);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.on("activereorder", socketActiveReorder);
    socket.on("reorder", socketReorder);

    return () => {
      console.log("delete re");
      socket.off("reorder", socketActiveReorder);
      socket.removeAllListeners("reorder");
      socket.off("activereorder", socketReorder);
    };
  }, [socket, username, questionName, data, lockUsernameInput]);

  const handleChange = (sourceId, sourceIndex, targetIndex, targetId) => {
    setData((old) => {
      const {
        lst_idxs,
        lst_keyframe_idxs,
        lst_keyframe_paths,
        lst_video_idxs,
        lst_frame_id_2_ms,
      } = old.data;
      const newData = {
        ...old,
        data: {
          lst_idxs: swap(lst_idxs, sourceIndex, targetIndex),
          lst_keyframe_idxs: swap(lst_keyframe_idxs, sourceIndex, targetIndex),
          lst_keyframe_paths: swap(
            lst_keyframe_paths,
            sourceIndex,
            targetIndex
          ),
          lst_video_idxs: swap(lst_video_idxs, sourceIndex, targetIndex),
          lst_frame_id_2_ms: swap(lst_frame_id_2_ms, sourceIndex, targetIndex),
        },
      };
      return newData;
    });
  };

  const handleUsername = (name) => {
    localStorage.setItem("username", name);
    setActiveReorder(false);
    setUsername(name);
    console.log("New username set: " + name);
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

  const send = (e) => {
    setLoading(true);
    setActiveReorder(false);
    socket.emit("viewsubmitted", {
      questionName: questionName,
    });
  };

  const reorder = () => {
    console.log("sent");
    console.log(data);
    setLoading(true);
    setActiveReorder(false);
    socket.emit("reorder", data);
  };

  const handleActiveReorder = () => {
    console.log("sent activereorder");
    socket.emit("activereorder", {
      questionName: data.questionName,
      user: username,
      isAdmin: admin,
    });
  };

  const handleDelete = (id) => {
    socket.emit("clearsubmit", {
      questionName: data.questionName,
      idx: id,
    });
  };

  const showDialog = (type, message) => {
    setInfoDialog({ type: type, message: message });
    setIsShown(true);
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

  return (
    <>
      <div
        style={{
          backgroundImage: 'url("/background.jpg")',
          width: '100%',
          height: '100vh', // Ensure the background covers the full viewport height
          backgroundSize: 'cover', // Ensure the background image covers the entire div
          backgroundRepeat: 'no-repeat', // Prevent the background image from repeating
          backgroundPosition: 'center', // Center the background image
        }}
        id="screen"
        className="flex flex-col relative p-4 w-screen h-screen"
        onClick={() => {
          document.getElementById("questions").style.display = "none";
        }}
      >
        <FullScreen
          relatedObj={relatedObj}
          fullScreenImg={fullScreenImg}
          setFullScreenImg={setFullScreenImg}
        />
        {Object.keys(infoDialog).length !== 0 && isShown && (
          <Info
            type={infoDialog.type}
            message={infoDialog.message}
            setIsShown={setIsShown}
          />
        )}
        {/* <ImageListSubmit
        imagepath={'/tree.jpg'}
        id={1}
        id_show={1}
        toggleFullScreen={() => {}}
      /> */}

        <div className="text-center ml-auto mb-4 flex gap-4 items-center">
        
          <button
            onClick={() => {
              if (!questionName) {
                alert("Please enter a question name.");
                return;
              }
              if (Object.keys(data).length !== 0) {
              //  console.log("data: ", data);
                if (QvsA && QvsAData.length > 0) {
                  download_QA(questionName, QvsAData, data.data.lst_video_idxs, data.data.lst_frame_id_2_ms);
                }
                else {
                  alert("Click and Enter into QvsA input!");
                }
              }
              else {
                alert("No data to download");
              }
            }}
            className="text-center items-center px-1 h-8 w-auto rounded-md border hover:border-none focus:border-none
          bg-slate-800 focus:bg-gradient-to-tr hover:bg-gradient-to-bl from-blue-400 via-blue-500 to-sky-400 
          transition-all hover:scale-90 border-sky-300/70 hover:text-slate-900 focus:text-slate-900"
          >
            Download QA
          </button>
          <button
            onClick={() => {
              if (!questionName) {
                alert("Please enter a question name.");
                return;
              }
              if (Object.keys(data).length !== 0) {
                download_KIS(questionName, data.data.lst_video_idxs, data.data.lst_frame_id_2_ms, data.data.lst_frame_id_2_ms);
              }
              else {
                alert("No data to download");
              }
            }}
            className="text-center items-center px-1 h-8 w-auto rounded-md border hover:border-none focus:border-none
          bg-slate-800 focus:bg-gradient-to-tr hover:bg-gradient-to-bl from-blue-400 via-blue-500 to-sky-400 
          transition-all hover:scale-90 border-sky-300/70 hover:text-slate-900 focus:text-slate-900"
          >
            Download KIS
          </button>

          <button
            onClick={() => {
              if (Object.keys(data).length !== 0) {
                console.log(data.data.lst_video_idxs);

                data.data.lst_idxs.forEach((id) => handleDelete(id));
                setQvsA(false);
                setQvsAData("");
                setData({});
              }
              else {
                alert("No data to Clear");
              }
            }}
            className="text-center items-center px-1 h-8 w-24 rounded-md border hover:border-none focus:border-none
          bg-slate-800 focus:bg-gradient-to-tr hover:bg-gradient-to-bl from-blue-400 via-blue-500 to-sky-400 
          transition-all hover:scale-90 border-sky-300/70 hover:text-slate-900 focus:text-slate-900"
          >
            Clear
          </button>
          <div className="relative">
            <button
              id="Q&A"
              onClick={() => handleQvsA()}
              className="text-center items-center px-1 h-8 w-14 mr-4 rounded-md border hover:border-none focus:border-none
            bg-slate-800 focus:bg-gradient-to-tr hover:bg-gradient-to-bl from-orange-400 via-red-500 to-red-400 
            transition-all hover:scale-90  border-red-500/70"
            >
              Q&A
            </button>
            <input
              tabIndex={1}
              id="Q&A"
              value={QvsAData}
              autoComplete="off"
              placeholder="Q&A..."
              readOnly={!QvsA}
              className={`w-32 h-8 transition-all placeholder:italic text-slate-300 relative indent-1 rounded-md bg-slate-800
                ${!QvsA ? 'blur-sm cursor-not-allowed' : ''}
              `}
              onChange={(e) => {
                handleQvsAData(e.target.value);
              }}
            />
          </div>
          {<button
            onClick={() => {
              if (!questionName) {
                alert("Please enter a question name.");
                return;
              }
              if (Object.keys(data).length !== 0) {
              //  console.log("data: ", data);
                if (QvsA && QvsAData.length > 0) {
                  download(data.data.lst_video_idxs, data.data.lst_keyframe_idxs, questionName, QvsAData);
                }
                else {
                  download(data.data.lst_video_idxs, data.data.lst_keyframe_idxs, questionName, "");
                }
              }
              else {
                alert("No data to download");
              }
            }}
            className="text-center items-center px-1 h-8 w-24 rounded-md border hover:border-none focus:border-none
          bg-slate-800 focus:bg-gradient-to-tr hover:bg-gradient-to-bl from-blue-400 via-blue-500 to-sky-400 
          transition-all hover:scale-90 border-sky-300/70 hover:text-slate-900 focus:text-slate-900"
          >
            Download
          </button>}

          <div className="questionname h-fit w-fit flex flex-col relative">
            <input
              value={questionName}
              id="questionName"
              tabIndex={1}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  document.getElementById("send").click();
                }
              }}
              onFocus={(e) => {
                // e.stopPropagation();
                document.getElementById("questions").style.display = "flex";
              }}
              onClick={(e) => {
                e.stopPropagation();
                getOwnedQuestions(username);
                document.getElementById("questions").style.display = "flex";
                console.log("click");
              }}
              type="search"
              placeholder="Get Question..."
              className="w-40 relative transition-all hover:drop-shadow-[0px_4px_3px_rgba(255,255,255,0.2)] placeholder:italic text-slate-300 relative  p-1 pl-4 rounded-full bg-slate-800"
              onChange={(e) => {
                setQuestionName(e.target.value);
              }}
            />
            <Questions
              isLoading={questionsLoading}
              questions={questions}
              username={username}
              setQuestionName={setQuestionName}
            />
          </div>
          <div className="relative username">
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
              className={`w-28 transition-all  
              placeholder:italic text-slate-300 relative p-1 pl-4 rounded-full
              ${lockUsernameInput
                  ? "bg-transparent border border-white/50 outline-none cursor-no-drop"
                  : "bg-slate-800"
                }
              `}
              onChange={(e) => {
                handleUsername(e.target.value);
              }}
            />
            <Lock lock={lockUsernameInput} setLock={setLockUsernameInput} />
          </div>

          <button
            id="send"
            onClick={() => send()}
            className="text-center items-center px-1 h-8 w-14 rounded-md border hover:border-none focus:border-none
          bg-slate-800 focus:bg-gradient-to-tr hover:bg-gradient-to-bl from-orange-400 via-red-500 to-red-400 
          transition-all hover:scale-90  border-red-500/70"
          >
            Send
          </button>
          <p>Admin</p>
          <Switch admin={admin} setAdmin={setAdmin}></Switch>
          <button
            onClick={() => handleActiveReorder()}
            className="text-center items-center px-1 h-8 w-20 rounded-md border hover:border-none focus:border-none
          bg-slate-800 focus:bg-gradient-to-tr hover:bg-gradient-to-bl from-sky-400 via-sky-500 to-blue-400 
          transition-all hover:scale-90 border-sky-500/70"
          >
            Active RE
          </button>
          <button
            disabled={!activeReorder}
            onClick={() => reorder()}
            className={`text-center items-center px-1 h-8 w-20 rounded-md focus:border-none
          bg-slate-800 focus:bg-gradient-to-tr transition-all focus:text-slate-900 
          ${activeReorder
                ? "hover:border-none border border-amber-500/50 hover:scale-90  hover:text-slate-900 hover:bg-gradient-to-bl from-amber-400 via-amber-500 to-red-400"
                : "opacity-60 disabled cursor-no-drop blur-sm"
              }
          `}
          >
            Reorder
          </button>
        </div>
        <div
          style={{ backgroundColor: "rgba(30, 58, 138, 0.6)" }}
          className="relative p-2  rounded-r-lg rounded-b-lg flex-auto bg-blue-900 "
        >
          {loading && <LoadingIcon />}
          <div
            style={{ backgroundColor: "rgba(30, 58, 138, 0.6)" }}
            className="px-2 absolute left-0 -top-12 w-fit h-12 rounded-t-lg flex items-center justify-center bg-slate-100"
          >
            {Object.keys(data).length !== 0 && (
              <p className="w-fit h-fit text-xl">
                <strong className="text-bold">
                  {data.questionName + " "}:
                </strong>
                {" " + data.data.lst_idxs.length}/100
              </p>
            )}
          </div>

          {/* ANSWER HERE !!! */}
          <GridContextProvider onChange={handleChange}>
            <div className="touch-none w-full h-full flex select-none overflow-y-auto">
              <GridDropZone
                className="flex flex-auto flex-wrap"
                id="submitImages"
                boxesPerRow={6}
                rowHeight={215}
              // style={{ height: 190 * Math.ceil(testList.length / 5) }}
              >
                {!loading &&
                  Object.keys(data).length !== 0 &&
                  data.data.lst_keyframe_paths.map((path, index) => {
                    const [id, id_show, id_2_ms] = [
                      data.data.lst_idxs[index],
                      data.data.lst_keyframe_idxs[index],
                      data.data.lst_frame_id_2_ms[index],
                    ];
                    return (
                
                      <GridItem key={id} className="flex flex-col items-center">
                        <ImageListSubmit
                          questionName={questionName}
                          handleSelect={() => handleSelect(id_show, data.data.lst_video_idxs[index])}
                          imagepath={path}
                          id={id}
                          id_show={id_show}
                          id_2_ms={id_2_ms}
                          handleDelete={handleDelete}
                          toggleFullScreen={() =>
                            toggleFullScreen({
                              imgpath: path,
                              id: id,
                            })
                          }
                        />
                        <p className="text-center text-lg underline decoration-sky-500/50">
                          {data.data.lst_video_idxs[index]}
                        </p>
                      </GridItem>
                    );
                  })}
                {/* 
                {testList.map((path, index) => {
                  return (
                    <GridItem
                      key={index}
                      className="flex flex-col items-center"
                    >
                      <ImageListSubmit
                        imagepath={path.path}
                        id={index}
                        id_show={path.id}
                        toggleFullScreen={() =>
                          console.log("Not yet implemented.")
                        }
                      />
                      <p className="text-center text-lg underline decoration-sky-500/50">
                        234897698
                      </p>
                    </GridItem>
                  );
                })} */}
              </GridDropZone>
            </div>
          </GridContextProvider>
        </div>
      </div>
    </>
  );
}
export default submit;
