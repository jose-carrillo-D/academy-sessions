'use strict'

window.addEventListener("load", async () => {

    const data = await (await fetch('data.json')).json();    
    const slider = document.querySelector(".slider-body");
    const infoSlides = document.querySelectorAll(".slider-data li");
    const imgSlides = slider.querySelectorAll("li");
    let currentRotation = 135;
    let blockClick = false;
    let prevClick = 0;
    
    //Load info slides
    infoSlides.forEach((slide, i) => {
        const index = (i != 3) ? i : data.length-1;
        setSlideInfoHTML({
            selector: slide, 
            data: data[index],
            i: index
        });
    });
    
    //Load img slides
    imgSlides.forEach((slide, i) => {
        const index = (i != 3) ? i : data.length-1;
        setSlideImageHTML({
            selector: slide,
            data: data[index],
            id: index
        });
    });
    
    //Set Rotation Event to all slides
    imgSlides.forEach(slide => slide.querySelector("img").addEventListener("click", (e) => imgSlidesClickEvent(slide)));
    
    function imgSlidesClickEvent(slide){
        const clicked = slide.getAttribute("data-info");
        if(!blockClick && prevClick != clicked){
            blockClick = true;
            prevClick = clicked;
            //Add fade out animations
            handleFadeOutAnimation(slide);
            //Generate dynamic slides
            loadInfiniteSlide(slide);
            //Handle rotation
            rotateSlide(slide);
            //Handle css classes updates
            updateCSSclasses(slide);
            setTimeout(()=> {
                //Display slide data
                displaySlideData(slide);
            } , 400);
        }
    }

    function handleFadeOutAnimation(slide){
        const info = infoSlides[slide.getAttribute("data-info")];
        const infoContainer = info.parentElement;
        const currentInfo = infoContainer.querySelector(".active");
        const action = slide.className;
        currentInfo.classList.add("hide");
        infoContainer.classList.add(action);
        setTimeout(()=>{
            infoContainer.classList.remove(action);
        },400);
    }
    
    function loadInfiniteSlide(slide){
        const hiddenImage = slider.querySelector("li.hidden");
        const hiddenInfo = infoSlides[hiddenImage.getAttribute("data-info")];
        const dataId = calcDataSlide(slide);
    
        setSlideInfoHTML({
            selector: hiddenInfo,
            data: data[dataId],
            i: dataId
        });
        setSlideImageHTML({
            selector: hiddenImage,
            data: data[dataId],
            id: dataId
        });
    
        hiddenImage.addEventListener("click", (e) => imgSlidesClickEvent(hiddenImage));
    }
    
    function setSlideInfoHTML({ selector: slide, data: {title, content, button}, i}){
        slide.innerHTML = `
            <h3>${title}</h3>
            <hr>
            <p>(${i+1}) ${content}</p>
            <a href="${button.src}" target="__blank">${button.label}</a>
        `;
    }
    
    function setSlideImageHTML({ selector: slide, data: {title, img}, id}){
        slide.setAttribute("data-id", id);
        slide.innerHTML = `
            <img src="${img}" alt="${title}" title="${title}">
        `;
    }
    
    function calcDataSlide(slide){
        const action = slide.className;
        const dataId = parseInt(slide.getAttribute("data-id"));
        let calc;
        switch (action) {
            case "prev":
                calc = dataId + 1;
                if(calc >= data.length) calc = 0;
            break;
            case "next":
                calc = dataId - 1;
                if(calc < 0) calc = data.length - 1;
            break;
        }
        return calc;
    }
    
    function rotateSlide(slide){
        //Calc and overwrite current rotation
        currentRotation = calcRotation(slide, currentRotation);
        //Set new rotation position
        slider.style.transform = `rotate(${currentRotation}deg)`;
    }
    
    function updateCSSclasses(slide){
        //Get current css classes
        const next = slide.getAttribute("data-next");
        const prev = slide.getAttribute("data-prev");
        //Reset CSS classes
        imgSlides.forEach(slide => slide.className = "hidden");
        //Update CSS classes
        setTimeout(()=>{
            slide.className = "active";
            setTimeout(()=>{
                blockClick = false;
            },200);
        },600);
        imgSlides[next].className = "next";
        imgSlides[prev].className = "prev";
    }
    
    function displaySlideData(slide){
        //Get current slide
        const slideNum = slide.getAttribute("data-info");
        //Reset CSS classes
        infoSlides.forEach(slide => slide.className = "");
        infoSlides[slideNum].classList.add("active");
    }
    
    function calcRotation(slide, currentRotation){
        const step = 90;
        const action = slide.className;
        switch (action) {
            case "prev":
                return currentRotation - step;
            case "next":
                return currentRotation + step;
        }
        return currentRotation;
    }

});






