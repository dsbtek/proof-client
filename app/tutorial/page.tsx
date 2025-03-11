"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import Cookies from "js-cookie";
import { IoMdCloseCircleOutline } from "react-icons/io";

import {
  HeaderText,
  Switch,
  TutorialGridView,
  TutorialListView,
  Modal,
  ListViewLoader,
  GridViewLoader,
  DinamicMenuLayout,
  DesktopSwitch,
} from "@/components";
import { authToken } from "@/redux/slices/auth";
import {
  setTutorialData,
  tutorialData,
  appData,
} from "@/redux/slices/appConfig";
import useResponsive from "@/hooks/useResponsive";
import { setCookie } from "@/utils/utils";

const Tutorial = () => {
  const tutsViewCookie = Cookies.get("tutsView");
  const [checked, setChecked] = useState(
    tutsViewCookie === "true" ? true : false
  );
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState(
    "https://rt-mobiletrekvideos.s3.amazonaws.com/chris+welcome+video+10-14-22.mp4"
  );
  const [videoPoster, setVideoPoster] = useState(
    "https://proof-drug-tutorial.s3.amazonaws.com/AppTutorial/Video Tutorial/Player.png"
  );
  const [isGridView, setIsGridView] = useState(false);
  const [isListView, setIsListView] = useState(true);
  const tokenCookie = Cookies.get("token");
  const isDesktop = useResponsive();

  const dispatch = useDispatch();
  const { participant_id, pin } = useSelector(authToken);
  const tutorial = useSelector(tutorialData);
  const { permissions } = useSelector(appData);
  const tutorialPermissions = permissions ? permissions.split(";") : undefined;

  const handleModal = () => {
    const tutorialVid = document.getElementById("tut-vid") as HTMLVideoElement;
    tutorialVid.pause();
    setShowModal(false);
  };

  const handleToggleGridView = () => {
    setIsGridView(true);
    setIsListView(false);
    // setChecked(false);
  };

  const handleToggleListView = () => {
    setIsListView(true);
    setIsGridView(false);
    // setChecked(true);
  };

  const handleSwitch = () => {
    if (tutsViewCookie === "false") {
      setCookie("tutsView", "true", 2000);
      setChecked(true);
    } else {
      setCookie("tutsView", "false", 2000);
      setChecked(false);
    }
  };

  const setVideoMetadata = (vidUrl: string, vidPoster: string) => {
    setVideoUrl(vidUrl);
    setVideoPoster(vidPoster);
  };

  const playTutorial = (vidUrl: string, vidPoster: string) => {
    setVideoMetadata(vidUrl, vidPoster);
    setShowModal(true);
  };

  const {
    data: tutsData,
    isLoading,
    refetch,
  } = useQuery("tutorial", {
    queryFn: async () => {
      const response = await fetch("/api/tutorial", {
        method: "POST",
        headers: {
          participant_id: participant_id as string,
          pin: pin as string,
        },
      });

      const data = await response.json();
      return data;
    },
    enabled: false,
    onSuccess: ({ data }) => {
      if (data.statusCode === 200) {
        dispatch(setTutorialData({ ...data }));
      } else {
        console.error(`Error ${data.statusCode}: ${data.message}`);
      }
    },
    onError: (error) => {
      toast.error("Sorry Cannot Fetch Data");
      console.error(error);
    },
  });

  useEffect(() => {
    if (tutorial.app_tutorial === undefined) {
      refetch();
    }
  }, [refetch, tutorial]);

  return (
    <DinamicMenuLayout>
      <Modal show={showModal} onClose={() => {}}>
        <IoMdCloseCircleOutline
          size={40}
          color="#009cf9"
          className="vid-close"
          onClick={handleModal}
        />

        <video
          id="tut-vid"
          className="tutorial-video"
          src={videoUrl}
          controls
          poster={videoPoster}
        >
          Your browser does not support the video tag
        </video>
      </Modal>
      <div className="tutorial-container">
        {!isDesktop ? (
          <>
            <HeaderText
              title={"Quick & Easy"}
              text={
                "Ready to Launch Proof Tutorials? Afterwards you can start your Proof Test."
              }
            />
            <div className="switch-wrap">
              {/* <p className="instruction">Select the Tutorial:</p> */}
              <Switch
                onToggleGridView={handleToggleGridView}
                onToggleListView={handleToggleListView}
                switchGridView={isGridView}
                switchListView={isListView}
              />
            </div>
          </>
        ) : (
          <DesktopSwitch
              title="Quick & Easy"
              description="Ready to Launch Proof Tutorials? Afterwards you can start your Proof Test."
              onToggleGridView={handleToggleGridView}
              onToggleListView={handleToggleListView} 
              switchGridView={isGridView}
              switchListView={isListView}          
            />
        )}

        <div className="tutorial-main">
          {isGridView ? (
            <div className="sub-wrap-grid_tutorial what-new-scroller">
              {!isLoading &&
                tutorial.app_tutorial !== undefined &&
                tutorial.app_tutorial
                  .filter(({ tutorial_name }: any) =>
                    tutorialPermissions.includes(tutorial_name)
                  )
                  .map((item: any, index: number) => (
                    <TutorialGridView
                      imgUrl={item.tut_image}
                      title={item.tutorial_name}
                      key={index}
                      onClick={() =>
                        playTutorial(item.tut_video, item.tut_image)
                      }
                    />
                  ))}

              {isLoading &&
                new Array(4)
                  .fill(0)
                  .map((_, index) => <GridViewLoader key={index} />)}

              {tutsData &&
                tutsData.data.statusCode !== 200 &&
                new Array(4)
                  .fill(0)
                  .map((_, index) => <GridViewLoader key={index} />)}

              {!isLoading &&
                tutorial.app_tutorial !== undefined &&
                tutorial.app_tutorial.length === 0 && (
                  <p>You do not have the permission to view tutorials</p>
                )}
            </div>
          ) : (
              <div className="sub-wrap_tutorial what-new-scroller">
              {!isLoading &&
                tutorial.app_tutorial !== undefined &&
                tutorial.app_tutorial
                  .filter(({ tutorial_name }: any) =>
                    tutorialPermissions.includes(tutorial_name)
                  )
                  .map((item: any, index: number) => (
                    <TutorialListView
                      key={index}
                      imgUrl={item.tut_image}
                      title={item.tutorial_name}
                      onClick={() =>
                        playTutorial(item.tut_video, item.tut_image)
                      }
                    />
                  ))}

              {isLoading &&
                new Array(4)
                  .fill(0)
                  .map((_, index) => <ListViewLoader key={index} />)}

              {tutsData &&
                tutsData.data.statusCode !== 200 &&
                new Array(4)
                  .fill(0)
                  .map((_, index) => <ListViewLoader key={index} />)}

              {!isLoading &&
                tutorial.app_tutorial !== undefined &&
                tutorial.app_tutorial.length === 0 && (
                  <p>You do not have the permission to view tutorials</p>
                )}
            </div>
          )}
        </div>
      </div>
    </DinamicMenuLayout>
  );
};

export default Tutorial;
