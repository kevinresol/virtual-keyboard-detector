import EventTarget from '@ungap/event-target'

let defaultInstance:VirtualKeyboardDetector;

const ua = navigator.userAgent;
const isIOS = /ipod|ipad|iphone/i.test(ua);
const isAndroid = !/like android/i.test(ua) && /android/i.test(ua);

export default class VirtualKeyboardDetector extends EventTarget {
	constructor() {
		super();
		const self = this;

		if(isIOS) {
			if('visualViewport' in window) {
				const visualViewport = (window as any).visualViewport;
				const onResize = function() {
					const keyboardVisible = window.outerHeight - visualViewport.height > 300;
					self.dispatchEvent(new VirtualKeyboardEvent(keyboardVisible));
				}
				
				visualViewport.addEventListener('resize', onResize);
			} else {
				// TODO: workaround for older ios, if we really want to support them
			}
		}

		if(isAndroid) {
			// assume keyboard not visible when initialized
			const uiHeight = window.screen.height - window.innerHeight;
			
			const onResize = function() {
				// const el = document.activeElement;
				const keyboardVisible = window.screen.height - window.innerHeight > uiHeight + 200;
				self.dispatchEvent(new VirtualKeyboardEvent(keyboardVisible));
			}
			
			window.addEventListener('resize', onResize);
		}
	}
	
	static get TYPE() {
		return 'virtualkeyboard';
	}
	
	static get INSTANCE() {
		return defaultInstance;
	}
}


defaultInstance = new VirtualKeyboardDetector();

class VirtualKeyboardEvent extends CustomEvent<any> {
	private _visible:boolean;
	
	constructor(visible) {
		super(VirtualKeyboardDetector.TYPE);
		this._visible = visible;
	}
	
	get visible() {
		return this._visible;
	}
}