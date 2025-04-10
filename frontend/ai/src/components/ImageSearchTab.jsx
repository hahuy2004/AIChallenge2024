import React, { useEffect, useState } from 'react';
import { web_url } from "../helper/web_url.js";
import VideoWrapper from './VideoWrapper.jsx';
import ImageListVideoPanel from './ImageListVideoPanel.jsx';
import PageButton from './PageButton.jsx';
import LoadingIcon from './LoadingIcon.jsx';
import { FaRegImages } from "react-icons/fa6";

function ImageSearchTab(props) {
    const {
        socket,
        handleKNN,
        toggleFullScreen,
        handleSelect,
        handleIgnore,
        getIgnoredImages,
        questionName,
        autoIgnore,
        addView,
        VIDEO_PER_PAGE,
    } = props;

    const reader = new FileReader();

    const [file, setFile] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(0);

    const handleChangeImage = (file) => {
        if (!file) return;

        setFile(file);
        reader.onload = () => {
            setImagePreview(reader.result);
        }

        reader.readAsDataURL(file);
    }

    const handleSubmit = (e) => {
        if (!file) return alert("Select a file first!");

        const formData = new FormData();
        formData.append('query_img', file);
        setLoading(true);

        fetch(`${web_url}/url-img-search`, {
            method: "POST",
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
            }),
            body: formData,
        })
            .then((data) => data.json())
            .then((result) => {
                handleSettingData(result);
            })
            .catch((e) => {
                alert("url img search failed!" + e);
                setLoading(false);
            });
    }

    const handleSettingData = (result) => {
        setPage(0);
        setVideos(result);
        setLoading(false);
    }

    const handleAutoIgnore = (page) => {
        if (questionName === "") alert("Type question first");
        else {
            const lst_video = videos.slice(
                page * VIDEO_PER_PAGE,
                page * VIDEO_PER_PAGE + VIDEO_PER_PAGE
            );
            let lst_idxs = [];
            lst_video.forEach((video) => {
                lst_idxs.push(...video.video_info.lst_idxs);
            });
            console.log(lst_idxs);
            // Remember to alert when user forgets to set questions
            socket.emit("ignore", {
                questionName: questionName,
                idx: lst_idxs,
                autoIgnore: true,
            });
        }
    };

    useEffect(() => {
        setImagePreview(null);
    }, [])

    return (
        <div className="w-[750px] ml-4 rounded-lg ">
            {imagePreview === null
                ? <FaRegImages className='max-w-[200px]' fontSize={200} />
                : <img src={imagePreview ?? 'data/KeyFrames/L01/V002/0036.webp'} alt='Default image' id='uploaded-image-preview' className='max-w-[200px]' />
            }


            <div className="flex items-center border-b border-teal-500 py-2 w-[750px] max-w-sm">
                <label className='flex-shrink-0 bg-cyan-500 hover:bg-cyan-700 border-cyan-500 hover:border-cyan-700 text-sm border-4 text-white py-1 px-8 rounded'
                    id='queryImgLabel'
                    htmlFor='query_img'>
                    {imagePreview === null
                        ? 'Select image to search'
                        : 'Change image'
                    }
                </label>
                <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    type="file" onChange={(e) => handleChangeImage(e.target.files[0])}
                    id='query_img' name='query_img' hidden={true}
                />


                <button className='flex-shrink-0 bg-slate-500 hover:bg-slate-700 border-slate-500 hover:border-slate-700 text-sm border-4 text-white py-1 px-8 mx-2 rounded'
                    type='button'
                    onClick={() => {
                        setImagePreview(null);
                        setFile('');
                    }}>
                    Clear image
                </button>
                <button className="flex-shrink-0 border-transparent border-4 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm py-1 px-2 rounded"
                    type="button" onClick={(e) => handleSubmit(e)}>
                    Submit
                </button>
            </div>

            <div
                id="url_images"
                className="relative flex-auto flex-col overflow-auto flex min-h-[100px] max-h-[550px] w-[750px] mt-6"
            >
                {loading === true ? <LoadingIcon />
                    : <>
                        {videos.length > 0 &&
                            videos
                                .map((video, indexVideo) => {
                                    const video_info = video.video_info;
                                    return (
                                        <React.Fragment key={`video-key-${indexVideo}`}>
                                            <VideoWrapper
                                                id={video.video_id}
                                                handleIgnore={() => handleIgnore(video_info.lst_idxs)}
                                            // isIgnored={getIsIgnored(indexVideo)}
                                            >
                                                {video_info.lst_keyframe_paths.map((path, index) => (
                                                    <div key={`video_info-key-${index}`}>
                                                        <ImageListVideoPanel
                                                            addView={addView}
                                                            imagepath={path}
                                                            questionName={questionName}
                                                            id={video_info.lst_idxs[index]}
                                                            id_show={video_info.lst_keyframe_idxs[index]}
                                                            handleKNN={handleKNN}
                                                            handleIgnore={handleIgnore}
                                                            isIgnored={getIgnoredImages(video_info.lst_idxs[index])}
                                                            handleSelect={() =>
                                                                handleSelect(
                                                                    video_info.lst_keyframe_idxs[index],
                                                                    video.video_id
                                                                )
                                                            }
                                                            toggleFullScreen={() =>
                                                                toggleFullScreen({
                                                                    imgpath: path,
                                                                    id: video_info.lst_idxs[index],
                                                                })
                                                            }

                                                        /></div>
                                                ))}
                                            </VideoWrapper>
                                            <hr className="border-1 my-6 bg-orange-400 border-slate-700"></hr>
                                        </React.Fragment>
                                    );
                                })}
                    </>
                }

            </div>


            {/* {videos.length > 0 && !loading && (
                console.log("total page", Math.floor(videos.length / VIDEO_PER_PAGE), page, videos.length),
                //Need to fix the pagination page
                <PageButton
                    totalPage={Math.floor(videos.length / VIDEO_PER_PAGE)}
                    //  totalPage={Math.floor(videos.length)}
                    page={page}
                    setPage={setPage}
                    autoIgnore={autoIgnore}
                    handleAutoIgnore={handleAutoIgnore}
                    DivID={"panel_images"}
                />
            )} */}
        </div>
    );
}

export default ImageSearchTab;