using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EsriLeaflet.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Returns a set of descriptions of the plugins available in the system. The descriptions are pulled
        /// down to the client and loaded asynchronously. The descriptions would be better placed in a json file
        /// within the plugin folders.
        /// </summary>
        public JsonResult GetPluginDescriptions()
        {
            return Json(new { 
                plugins = new List<object>() { 
                    new { 
                        name = "Layer Control",
                        basePath = "/Plugins/LayerControl",
                        script = "/Scripts/layerControl.js",
                        css = "/Css/layerControl.css",
                        template = "/LayerControl.html"
                    },
                    new { 
                        name = "Editor",
                        basePath = "/Plugins/Editor",
                        script = "/Scripts/editor.js",
                        css = "/Css/editor.css",
                        template = "/Editor.html"
                    }
                }
            }, JsonRequestBehavior.AllowGet);
        }
    }
}