
let VRButton = {
    createButton : async (gl, options) => {
        if(options && options.referenceSpaceType) {
            gl.xr.setReferenceSpaceType(options.
                referenceSpaceType);
        }

        const notFound = () => {
            console.log("immersive-vr not found");
        }
        
        const enterVR = async (button) => {
            button.textContent = "Enter VR";
            let currSession = null;
        
            const onSessionStarted = (session) => {
                session.addEventListener('end', onSessionEnded);
                gl.xr.setSession(session);
                button.textContent = 'Exit VR';
                currSession = session;
            }
        
            const onSessionEnded = (event) => {
                currSession.removeEventListener('end', onSessionEnded);
                button.textContent = 'Enter XR';
                currSession = null;
            }
        
        
        
            button.addEventListener("click", async () => {
                if(currSession === null) {
                    let sessionInit = {
                        optionalFeatures: ["local-floor", "bounded-floor"]
                    };
                    const vrSession = await navigator.xr.requestSession("immersive-vr", sessionInit);
                    onSessionStarted(vrSession);
                }
                else{
                    currSession.end();
                }
            });
        }

        if(navigator.xr) {
            let button = document.createElement("button");
            const isSupported = await navigator.xr.isSessionSupported("immersive-vr");
        
            if(isSupported) {
                enterVR(button);
            }
            else{
                notFound();
            }
            return button;
        }
        else {
            if(window.isSecureContext === false) {
                console.log("WebXR needs HTTPS");
            }
            else{
                console.log("WebXR is not available");
            }
        }
    }
};



export {VRButton};