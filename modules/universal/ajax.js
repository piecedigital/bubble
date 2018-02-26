"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _nodeFetch = require("node-fetch");

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

// server and browser support for a single point for HTTP requests
if (typeof window === "object") {
	module.exports = function (optionsObj) {
		optionsObj = optionsObj || {};

		var httpRequest = new XMLHttpRequest();
		if (typeof optionsObj.upload === "function") httpRequest.upload.addEventListener("progress", optionsObj.upload, false);
		httpRequest.onreadystatechange = function (data) {
			if (httpRequest.readyState === 4) {
				if (httpRequest.status < 400) {
					if (typeof optionsObj.success === "function") {
						optionsObj.success(data.target.response);
					} else {
						console.log("no success callback in ajax object");
					}
				} else {
					if (typeof optionsObj.error === "function") {
						optionsObj.error({
							"status": data.target.status,
							"message": data.target.statusText,
							"response": data.target.response
						});
					} else {
						console.log("no error callback in ajax object. logging error below");
						console.error(data.target.status, data.target.statusText);
					}
				}
			}
		};
		var contentTypes = {
			jsonp: "application/javascript; charset=UTF-8",
			json: "application/json; charset=UTF-8",
			text: "text/plain; charset=UTF-8",
			formdata: "multipart/form-data; boundary=---------------------------file0123456789end"
		};

		httpRequest.open((optionsObj.type || "").toUpperCase() || "GET", optionsObj.url, optionsObj.multipart || true);
		if (optionsObj.dataType) httpRequest.setRequestHeader("Content-Type", "" + contentTypes[optionsObj.dataType.toLowerCase() || "text"]);
		if (typeof optionsObj.beforeSend == "function") {
			optionsObj.beforeSend(httpRequest);
		}
		httpRequest.send(optionsObj.data || null);
	};
} else {
	module.exports = function (optionsObj) {
		var headers = {};

		if (typeof optionsObj.beforeSend == "function") {
			optionsObj.beforeSend({
				setRequestHeader: function setRequestHeader(header, value) {
					headers[header] = value;
				}
			});
		}

		(0, _nodeFetch2["default"])(optionsObj.url, {
			method: (optionsObj.type || "").toUpperCase() || "GET",
			headers: headers
		}).then(function (res) {
			res.json().then(function (data) {
				optionsObj.success(data);
			});
		})["catch"](function (data) {
			optionsObj.error(data);
		});
	};
}