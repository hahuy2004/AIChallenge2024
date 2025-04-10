import React, { useState } from 'react';
import { IoIosSettings } from "react-icons/io";
import { Dialog } from '@headlessui/react'
import Toggle from './Toggle';

function SettingsModal({ usernameIndex, bgColor, setBgColor, handleSave }) {
    const [show, setShow] = useState(false);

    const [numberOfFrames, setNumberOfFrames] = useState(500);
    const [modelCLIPCheck, setModelCLIPCheck] = useState(false);
    const [modelCLIPV2Check, setModelCLIPV2Check] = useState(true);
    const [numberOfFilter, setNumberOfFilter] = useState(3);
    const [selectedFilter, setSelectedFilter] = useState('No Filter');
    const [username, setUsername] = useState(usernameIndex);

    const [numberOfVideosPerPage, setNumberOfVideosPerPage] = useState(7);


    const toggleRTextColor = () => {
        return bgColor ? "text-gray-900" : "text-slate-300"
    }

    const resetSettings = () => {
        if(window.confirm("Are you sure to reset your current settings to the default one? This action cannot be undone ...") === true) {
            setUsername(usernameIndex);
            setNumberOfFrames(500);
            setModelCLIPCheck(false);
            setModelCLIPV2Check(true);
            setNumberOfVideosPerPage(7);
            setSelectedFilter('No Filter');
            setNumberOfFilter(3);
        }
    }

    const handleClickSaveChanges = () => {
        handleSave({
            username: username,
            numberOfFrames: numberOfFrames,
            modelCLIPCheck: modelCLIPCheck,
            modelCLIPV2Check: modelCLIPV2Check,
            numberOfVideosPerPage: numberOfVideosPerPage,
            selectedFilter: selectedFilter,
        }); 

        setShow(false);
    }

    return (
        <div>
            <button type='button'
              onClick={() => setShow(true)}
              data-modal-target="settings-modal" data-modal-toggle="settings-modal"
              className="mr-4 z-50 p-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              <IoIosSettings size={24} color='green'/>
            </button>

            <Dialog open={show} onClose={setShow} className="relative z-50 min-w-[800px]">
                <Dialog.Backdrop
                    transition="true"
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Dialog.Panel 
                            transition="true"
                            className="min-w-[1200px] relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                        >
                            <div className="w-full bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="w-full sm:flex sm:items-start">
                                    <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h1" className="min-h-[75px] text-center text-5xl font-bold text-white-900 bg-teal-600 leading-normal">
                                            Settings
                                        </Dialog.Title>

                                        <div style={{
                                            backgroundImage: bgColor ? 'none' : 'url("/background.jpg")',
                                            width: '100%',
                                            // height: '100vh', // Ensure the background covers the full viewport height
                                            backgroundSize: 'cover', // Ensure the background image covers the entire div
                                            backgroundRepeat: 'no-repeat', // Prevent the background image from repeating
                                            backgroundPosition: 'center', // Center the background image
                                        }}
                                         className="mt-2 divide-y divide-green-500">
                                            <section id="general-section" className='w-full py-8 '>
                                                <div id="username-settings" className='w-full pl-2 grid grid-cols-12 gap-2 items-center my-4'>
                                                    <label htmlFor="username" className={`col-span-2 w-full leading-normal flex-none block italic text-lg font-medium ${toggleRTextColor()}`}>
                                                       Username: 
                                                    </label>
                                                    <input type="text" id="username" autoFocus={true}
                                                    className="col-span-2 w-full bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    placeholder='Enter the username ...'
                                                    value={username} onChange={(e) => setUsername(e.target.value)}
                                                    />
                                                    <p id="username-explanation" className="col-span-8 leading-normal text-base text-gray-500 pl-4 dark:text-gray-400">
                                                        The username that is searching for the query and wanting to submit under his / her name.
                                                    </p>
                                                </div>
                                                <div id="number-of-frames-settings" className='w-full pl-2 grid grid-cols-12 gap-2 items-center my-4'>
                                                    <label htmlFor="number-of-frames" className={`col-span-2 w-full leading-normal flex-none block italic text-lg font-medium ${toggleRTextColor()}`}>
                                                        Number of frames: 
                                                    </label>
                                                    <input type="number" id="number-of-frames" autoFocus={true}
                                                    className="col-span-2 w-full bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    value={numberOfFrames} onChange={(e) => setNumberOfFrames(e.target.value)}
                                                    />
                                                    <p id="number-of-frames-explanation" className="col-span-8 leading-normal text-base text-gray-500 pl-4 dark:text-gray-400">
                                                        The number of frames that will be returned for each text query.
                                                    </p>
                                                </div>
                                                <div id="models-settings" className='w-full pl-2 grid grid-cols-12 gap-2 items-center my-4'>
                                                    <h1 className={`col-span-2 w-full leading-normal block italic text-lg font-medium ${toggleRTextColor()}`} >
                                                        Models: 
                                                    </h1>
                                                    <div className="col-span-2 w-full flex">
                                                        <div className="flex-none mx-4">
                                                            <input type="checkbox" id="model-CLIP"
                                                            className=" w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                                                            checked={modelCLIPCheck} onChange={(e) => setModelCLIPCheck(e.target.checked)}
                                                            />
                                                            <label htmlFor="model-CLIP" className={`ms-2 text-sm font-medium ${toggleRTextColor()}`}>
                                                                CLIP
                                                            </label>
                                                        </div>
                                                        <div className='flex-none mx-4'>
                                                            <input type="checkbox" id="model-CLIPV2"
                                                            className=" w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                                                            checked={modelCLIPV2Check} onChange={(e) => setModelCLIPV2Check(e.target.checked)}
                                                            />
                                                            <label htmlFor="model-CLIPV2" className={`ms-2 text-sm font-medium ${toggleRTextColor()}`}>
                                                                CLIPV2
                                                            </label>
                                                        </div>

                                                    </div>
                                                    
                                                    <p id="number-of-frames-explanation" className="col-span-8 pl-4 leading-normal text-base text-gray-500 dark:text-gray-400">
                                                        The model used to generate the frames result.
                                                    </p>
                                                </div>
                                                <div id="dark-mode-settings" className='w-full pl-2 grid grid-cols-12 gap-2 items-center my-4'>
                                                    <h1 className={`col-span-2 w-full leading-normal block italic text-lg font-medium ${toggleRTextColor()}`}>
                                                        Dark mode: 
                                                    </h1>
                                                    <div className="col-span-2 w-full flex">
                                                        <Toggle bgColor={bgColor} setBgColor={setBgColor} />
                                                    </div>
                                                    
                                                    <p id="number-of-frames-explanation" className="col-span-8 pl-4 leading-normal text-base text-gray-500 dark:text-gray-400">
                                                        The feature allowing user to change the theme of the application.
                                                    </p>
                                                </div>
                                                <div id="number-of-videos-per-page-settings" className='w-full pl-2 grid grid-cols-12 gap-2 items-center my-4'>
                                                    <label htmlFor="number-of-videos-per-page" className={`col-span-2 w-full leading-normal flex-none block italic text-lg font-medium ${toggleRTextColor()}`}>
                                                        Number of videos / page: 
                                                    </label>
                                                    <input type="number" id="number-of-videos-per-page" autoFocus={true}
                                                    className="col-span-2 w-full bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    value={numberOfVideosPerPage} onChange={(e) => setNumberOfVideosPerPage(e.target.value)}
                                                    />
                                                    <p id="number-of-videos-per-page-explanation" className="col-span-8 leading-normal text-base text-gray-500 pl-4 dark:text-gray-400">
                                                        The number of videos with its selected frames to show on each page.
                                                    </p>
                                                </div>
                                                <div id="filter-options-settings" className='w-full pl-2 grid grid-cols-12 gap-2 items-center my-4'>
                                                    <label htmlFor="filter-options" className={`col-span-2 w-full leading-normal block italic text-lg font-medium ${toggleRTextColor()}`}>
                                                        Filter Options:
                                                    </label>
                                                    <div className="col-span-2 w-full flex">
                                                    <select id="filter-options" 
                                                    className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}
                                                    >
                                                        <option value="No Filter">No Filter</option>
                                                        <option value="Filter Forwards" >Filter Forwards</option>
                                                        <option value="Filter Backwards" >Filter Backwards</option>
                                                    </select>
                                                    </div>
                                                    
                                                    <p id="filter-options-explanation" className="col-span-8 pl-4 leading-normal text-base text-gray-500 dark:text-gray-400">
                                                        The filter options on frame result.
                                                    </p>
                                                </div>
                                                <div id="number-of-filters-settings" className='w-full pl-2 grid grid-cols-12 gap-2 items-center my-4'>
                                                    <label htmlFor="number-of-filters" className={`col-span-2 w-full leading-normal flex-none block italic text-lg font-medium ${toggleRTextColor()}`}>
                                                        Number of filters: 
                                                    </label>
                                                    <input type="number" id="number-of-filters" autoFocus={true}
                                                    className="col-span-2 w-full bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    value={numberOfFilter} onChange={(e) => setNumberOfFilter(e.target.value)}
                                                    />
                                                    <p id="number-of-filters-explanation" className="col-span-8 leading-normal text-base text-gray-500 pl-4 dark:text-gray-400">
                                                        The number of sentences wanting to apply filter.
                                                    </p>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    onClick={() => handleClickSaveChanges()}
                                    className="min-h-[48px] inline-flex w-full justify-center items-center rounded-md bg-green-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                >
                                    Save changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => resetSettings()}
                                    className="min-h-[48px] inline-flex w-full justify-center items-center rounded-md bg-blue-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShow(false)}
                                    className="min-h-[48px] mt-3 inline-flex w-full justify-center items-center rounded-md bg-white px-3 py-2 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default SettingsModal;