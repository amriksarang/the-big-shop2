import React, { useEffect } from 'react';

let selector: HTMLDivElement, 
        imageContainer: HTMLDivElement, 
        imageContainerRect: DOMRect, 
        imageContainerRectLeft: number, 
        imageContainerRectRight: number, 
        imageContainerRectTop: number, 
        imageContainerRectBottom: number,
        selectorWidth: number, 
        selectorHeight: number,
        largeImage: HTMLImageElement,
        magnifiedImage: HTMLImageElement,
        magnifiedImageCanvas: HTMLImageElement;

const checkImageElementInitialization = function(){
    if(!largeImage)
        largeImage = document.getElementById("large-image") as HTMLImageElement; 
    if(!magnifiedImage)
        magnifiedImage = document.getElementById("magnified-image") as HTMLImageElement;
        magnifiedImage.style.position = 'absolute';
    
    if(!magnifiedImageCanvas)
        magnifiedImageCanvas = document.getElementById("magnifier-canvas") as HTMLImageElement;
}



const pointerCloseToBottomEdge = function(clientY: number){
    checkElementInitialization();
    
    const pointerY = clientY;
    const yPos = (imageContainerRectBottom - pointerY);
    
    if(yPos > selectorHeight / 2){
        return false;
    }
   
    return true;
}

const moveSelectorToBottomEdge = function(){
    checkElementInitialization();
    
        
    selector.style.bottom = '0px';
}

const moveSelectorYPositionToPointerCenter = function(clientY: number){
    checkElementInitialization();      
          
    selector.style.top = clientY  - imageContainerRectTop - selectorHeight/2  + 'px';
    
}



const pointerCloseToTopEdge = (clientY: number) => {
    checkElementInitialization();
    
    const pointerY = clientY;
    const yPos = (pointerY - imageContainerRectTop);
    
    if(yPos > selectorHeight / 2){
        return false;
    }
    return true;
}

const moveSelectorToTopEdge = function(){
    checkElementInitialization();
    selector.style.top = '0px';
}

const pointerCloseToLeftEdge = function(clientX: number){
    checkElementInitialization();

    const xPos = (clientX - imageContainerRectLeft);

    if(xPos > selectorWidth / 2){
        return false;
    }
    return true;

}

const moveSelectorToLeftEdge = function(){
    checkElementInitialization();
    selector.style.left = '0px';
}

const pointerCloseToRightEdge = function(clientX: number){
    checkElementInitialization();

    const xPos = ( imageContainerRectRight- clientX);

    if(xPos > selectorWidth / 2){
        return false;
    }
    return true;

}

const moveSelectorToRightEdge = function(){
    checkElementInitialization();
    selector.style.right = '0px';
}

const moveSelectorXPositionToPointerCenter = function(clientX: number){
    checkElementInitialization();        
       
    selector.style.left = clientX - imageContainerRectLeft - selectorWidth/2 + 'px';
    
}

const checkElementInitialization = function(){
    if(!selector) {
        selector = document.getElementsByClassName("mouseover-selector")[0] as HTMLDivElement;  //get selector rectangle
        selectorWidth = selector.offsetWidth;
        selectorHeight = selector.offsetHeight;
    }
    if(!imageContainer){
        imageContainer = document.getElementsByClassName("image-container")[0] as HTMLDivElement; // get regular size image container
    }
    
    imageContainerRect = imageContainer.getBoundingClientRect();
    imageContainerRectLeft = imageContainerRect.left;
    imageContainerRectTop = imageContainerRect.top
    imageContainerRectRight = imageContainerRect.right;
    imageContainerRectBottom = imageContainerRect.bottom;
    
    
}

const positionMagnifiedImageInCanvas = function(){
    checkImageElementInitialization();

    
    magnifiedImageCanvas.style.height = '70vh';

    let magnifiedHeight = magnifiedImage.height;
    let magnifiedWidth = magnifiedImage.width;

    let imageHeight = largeImage.height;
    let imageWidth = largeImage.width;

    let heightRatio = magnifiedHeight/imageHeight;
    let widthRatio = magnifiedWidth/imageWidth;

    let rect = selector.getBoundingClientRect();
    let rect2 = largeImage.getBoundingClientRect();

    let netBottom = rect2.bottom - rect.bottom;
    let adjustedNetBottom = netBottom * heightRatio;

    let netLeft = rect.left - rect2.left;
    let adjustedNetLeft = netLeft * widthRatio;

    magnifiedImage.style.bottom = -adjustedNetBottom + 'px';
    magnifiedImage.style.left = -adjustedNetLeft + 'px';
}

const mouseoverSelectorPositionController = function(e: React.MouseEvent) { 
    
    checkElementInitialization();
    selector.style.display = 'unset';
    
    // control Y position of rectangle
    if(pointerCloseToBottomEdge(e.clientY)){
        moveSelectorToBottomEdge(); // restrict travel beyond bottom edge 
    }else if(pointerCloseToTopEdge(e.clientY)){
        moveSelectorToTopEdge()     // restrict travel beyond top edge 
    }else{
        moveSelectorYPositionToPointerCenter(e.clientY);
    }

    // control X position of rectangle
    if(pointerCloseToLeftEdge(e.clientX)){
        moveSelectorToLeftEdge();
    }else if(pointerCloseToRightEdge(e.clientX)){
        moveSelectorToRightEdge();
    }else{
        moveSelectorXPositionToPointerCenter(e.clientX);
    }

    positionMagnifiedImageInCanvas();

}

const handleMouseLeave = function(e: React.MouseEvent){
    if(magnifiedImageCanvas)
        magnifiedImageCanvas.style.height = '0px';
    if(selector)
        selector.style.display = 'none';
}

const LargeImageContainer = ({className, largeImageSrc}: {className: string, largeImageSrc: string}) => {
    useEffect(() => {
        checkElementInitialization();
    }, [largeImageSrc]);

    return <div onMouseMove={mouseoverSelectorPositionController} className={className} onMouseLeave={handleMouseLeave}>
    <div className="mouseover-selector" ></div>
    <img id="large-image" src={largeImageSrc} alt="main"/>
</div>
}
export default LargeImageContainer;
