var ImageRotator = function (options) {
    this.width = options.width + 'px';
    this.height = options.height + 'px';
    this.imageUrls = options.images;
    this.interval = options.interval;
    this.transition = options.transition;
    this.loading = ko.observable(true);
    this.imageViewModels = [];
    options.images.forEach(function (image) {
        var imageViewModel = {url:image, active:ko.observable(false)};
        this.imageViewModels.push(imageViewModel);
    }.bind(this));
    this.imageViewModels[0].active(true);
    this.images = ko.observableArray();
    this.jsInt = setInterval(this.nextImage.bind(this), this.interval);
    this.loadFirstImage();
};


ImageRotator.prototype.nextImage = function () {
    this.images.valueWillMutate();
    var top = this.images.pop();
    var ind = this.imageViewModels.indexOf(top);
    var nextInd = (ind + 2) % this.imageViewModels.length;
    var next = this.imageViewModels[nextInd];
    this.images.unshift(next);
    top.active(false);
    this.images()[1].active(true);
    this.images.valueHasMutated();
};

ImageRotator.prototype.onCtrlClick = function (imageVM) {
    if (imageVM == this.images()[1]) {
        return;
    }
    clearInterval(this.jsInt);
    var top = this.images.pop();
    this.images()[0] = imageVM;
    var ind = this.imageViewModels.indexOf(imageVM);
    var nextInd = (ind + 1) % this.imageViewModels.length;
    var next = this.imageViewModels[nextInd];
    this.images.unshift(next);
    top.active(false);
    imageVM.active(true);
    this.images.valueHasMutated();
    this.jsInt = setInterval(this.nextImage.bind(this), this.interval);
};

ImageRotator.prototype.removeDecorator = function (elem) {
    var removeElement = function () {elem.parentNode.removeChild(elem)};
    elem.addEventListener('webkitTransitionEnd', removeElement);
    elem.addEventListener('TransitionEnd', removeElement);
    elem.style.left = this.width;
    elem.style['-webkit-transition'] = elem.style['transition'] = this.transition;
};

ImageRotator.prototype.loadFirstImage = function () {
    var first = this.imageUrls.shift();
    var imageEl = document.createElement('img');
    imageEl.addEventListener('load', function (e) {
        this.images.push(this.imageViewModels[0]);
        this.images.unshift(this.imageViewModels[1]);
        this.loading(false);
        this.imageUrls.shift();
        this.loadOtherImages();
    }.bind(this));
    imageEl.src = first;
};

ImageRotator.prototype.loadOtherImages = function () {
    this.imageUrls.forEach(function (image) {
        var imageEl = document.createElement('img');
        imageEl.addEventListener('load', function (e) {            //nothing yet
        }.bind(this));
        imageEl.src = image;
    }.bind(this));
};
