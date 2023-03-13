import * as React from "react"

export enum FacingMode {
    user = 'user',
    environment = 'environment',
}

interface Props {
    facingMode: FacingMode,
    onTakePhoto: Function,
    onColor: Function,
}

export default function CameraColorPick(props: Props) {
    const {
        facingMode,
        onTakePhoto,
        ...rest
    } = props
    const [photoDataUri, setPhotoDataUri] = React.useState("")

    let video = React.useRef<HTMLVideoElement>()
    let stream = React.useRef<MediaStream | null>()
    let myCanvas = React.useRef(null)

    React.useEffect(() => {
        if (navigator.mediaDevices) startCamera()

        let timer = setInterval(() => {
            if (props.onColor) {
                props.onColor(getColorAt(video.current, 207, 368))
            }
        }, 375)

        return () => {
            clearInterval(timer)
        }
    }, [])

    function getColorAt(webcam: any, x: number, y: number) {
        // To be able to access pixel data from the webcam feed, we must first draw the current frame in
        // a temporary canvas.
        var canvas = (myCanvas.current as any)
        var context = canvas.getContext("2d")
        canvas.width = 414
        canvas.height = 736
        context.drawImage(webcam, 0, 0, 414, 736)

        // Then we grab the pixel information from the temp canvas and return it as an object
        var pixel = context.getImageData(x, y, 1, 1).data
        return {
            r: pixel[0],
            g: pixel[1],
            b: pixel[2],
        }
    }

    const startCamera = () => {
        // https://stackoverflow.com/questions/27420581/get-maximum-video-resolution-with-getusermedia
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    facingMode: props.facingMode,
                    width: { ideal: 4096 },
                    height: { ideal: 2160 },
                },
            })
            .then((feed) => {
                stream.current = feed
                const videoRef = video.current as any;
                videoRef.srcObject = stream.current
                videoRef.play()
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    const stopCamera = () => {
        if (stream.current) {
            stream.current.getTracks().forEach(function (track) {
                track.stop()
            })
            stream.current = null
        }
    }

    const takePhoto = () => {
        const canvas = document.createElement("canvas") as any;

        const videoRef = video.current as any;

        canvas.width = videoRef?.videoWidth
        canvas.height = videoRef?.videoHeight
        canvas.getContext("2d").drawImage(videoRef, 0, 0)

        // Other browsers will fall back to image/png
        let photo = canvas.toDataURL("image/webp")

        setPhotoDataUri(photo)
        props.onTakePhoto(photo)

        // Now that we have the photo, stop the camera
        stopCamera()
    }

    const getPhoto = () => {
        return photoDataUri
    }

    const resetCamera = () => {
        setPhotoDataUri("")
        startCamera()
    }

    return (
        <div style={{width: 384, height: 384}}>
            <canvas
                ref={myCanvas}
                style={{
                    width: 384,
                    height: 384,
                    display: "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
            />
            <img
                src={getPhoto()}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "50% 50%",
                    display: getPhoto() == "" ? "none" : "block",
                }}
            />

            <video
            //@ts-ignore
                ref={video}
                autoPlay={true}
                muted={true}
                controls={false}
                preload="auto"
                playsInline
                style={{
                    width: "384px",
                    height: "384px",
                    objectFit: "cover",
                    objectPosition: "50% 50%",
                    display: getPhoto() == "" ? "block" : "none",
                    borderRadius: 24,
                }}
            ></video>
        </div>
    )
}