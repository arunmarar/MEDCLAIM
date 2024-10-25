sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/library",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (e, t, a, i, s, r, o) {
    "use strict";
    var l = [];
    var d,
        n,
        g;
    var h = i.URLHelper;
    return e.extend("Gail.Medical_Claim.controller.Detail", {
        formatter: a,
        onInit: function () {
            var e = new sap.ui.model.json.JSONModel({
                data: [
                    {
                        key: "No",
                        text: "No"
                    }, {
                        key: "Yes",
                        text: "Yes"
                    }
                ]
            });
            this.setModel(e);
            var a = new t({busy: false, delay: 0});
            var i = this.getOwnerComponent().getModel("RouteModel");
            i.setProperty("/split", true);
            i.setProperty("/normal", false);
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(a, "detailView");
            this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
            var s = new sap.ui.model.json.JSONModel;
            this.getView().setModel(s, "patientModel");
            var o = this.getOwnerComponent().getModel();
            var l = this;
            o.read("/f4_patientSet", {
                success: function (e) {
                    sap.ui.core.BusyIndicator.hide();
                    //var t = e.results.filter(e => {
                    //    var t = e.Text.includes("Child");
                    //    let a = e.Text.match(/\(( \d+ )\)/);
                    //    if (a) {
                    //        a = parseInt(a[1]);
                    //        if (t) 
                    //            return a <= 31;
                    //         else 
                    //            return a > 0
                    //        
                    //    }
                    //});
                    //l.getView().getModel("patientModel").setProperty("/patientData", t)
                    l.getView().getModel("patientModel").setProperty("/patientData", e.results)
                },
                error: function (e) {
                    r.error("Error while loading patient data");
                    sap.ui.core.BusyIndicator.hide()
                }
            })
        },
        onSendEmailPress: function () {
            var e = this.getModel("detailView");
            h.triggerEmail(null, e.getProperty("/shareSendEmailSubject"), e.getProperty("/shareSendEmailMessage"))
        },
        _onObjectMatched: function (e) {
            var t = e.getParameter("arguments").objectId;
            g = atob(t);
            this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
            if (sap.ui.Device.system.phone) {
                this.getOwnerComponent().getModel("buttonsModel").setProperty("/navbackDetail", true)
            } else {
                this.getOwnerComponent().getModel("buttonsModel").setProperty("/navbackDetail", false)
            }
            var a = this.getOwnerComponent().getModel("RouteModel");
            a.setProperty("/split", true);
            a.setProperty("/normal", false);

            // changes started by Usmana          
            var v = this.getView().getModel("InitialModel");
            var i = 0;
            var C = this;
            v.read("/EMP_FAMILY_DETAILSSet", {
                success: function (e) {
                    var a = C.getOwnerComponent().getModel("empFamDetails");
                    a.setData(e.results)
                },
                error: function (e) {
                    alert("Error")
                }
            });
            // changes ended by Usmana


            if (g == "0") {
                d = "Create";
                var i = this.getView().byId("detailPage");
                i.removeAllContent();
                this.getView().byId("itemName").setSelectedKey("");
                l = [];
                var s = this.getOwnerComponent().getModel("detailMasterModel");
                s.setData(l);
                var r = this.getOwnerComponent().getModel("buttonsModel");
                r.setProperty("/rSaveDraft", true);
                r.setProperty("/rSubmit", true);
                r.setProperty("/mAdd", false);
                r.setProperty("/mReview", false);
                r.setProperty("/dAdd", true);
                r.setProperty("/dSave", false);
                r.setProperty("/dClear", true);
                r.setProperty("/dEdit", false);
                r.setProperty("/dSelect", true);
                r.setProperty("/mDelete", false)
            } else if (g == "1") {
                d = "Create";
                var i = this.getView().byId("detailPage");
                i.removeAllContent();
                this.getView().byId("itemName").setSelectedKey("");
                var r = this.getOwnerComponent().getModel("buttonsModel");
                r.setProperty("/dAdd", true);
                r.setProperty("/dSave", false);
                r.setProperty("/dClear", true);
                r.setProperty("/dEdit", false);
                r.setProperty("/dSelect", true);
                r.setProperty("/mDelete", false)
            } else {
                this.ItemDisplay()
            }
        },
        ItemDisplay: function () {
            var e = this.getOwnerComponent().getModel("buttonsModel");
            e.setProperty("/dEdit", true);
            e.setProperty("/dAdd", false);
            e.setProperty("/dSave", false);
            e.setProperty("/dClear", false);
            e.setProperty("/dSelect", false);
            var t = e.getProperty("/showEdit");
            if (! t) {
                e.setProperty("/dEdit", false);
                e.setProperty("/mDelete", false)
            } else {
                e.setProperty("/mAdd", true);
                e.setProperty("/dEdit", true);
                e.setProperty("/mDelete", true)
            } d = "Display";
            l = this.getOwnerComponent().getModel("detailMasterModel").getData();
            var a = this.getOwnerComponent().getModel("detailMasterModel").getObject(g).C04t3;
            switch (a) {
                case "CON": a = "Consultation";
                    break;
                case "MED": a = "Medicines";
                    break;
                case "TST": a = "Tests";
                    break;
                case "HOS": a = "Hospitalization";
                    break;
                case "TRV": a = "Travel";
                    break;
                case "OTH": a = "Others";
                    break
            }
            n = a;
            var i = n + d;
            this._showFormFragment(i);
            var s = this.getView().byId("form" + i);
            s.bindElement("detailMasterModel>" + g)
        },
        _onMetadataLoaded: function () {
            var e = this.getView().getBusyIndicatorDelay(),
                t = this.getModel("detailView");
            t.setProperty("/delay", 0);
            t.setProperty("/busy", true);
            t.setProperty("/delay", e)
        },
        onItemSelection: function (e) {
            var t = e.getParameter("selectedItem").getText();
            var a = e.getSource().getProperty("selectedKey");
            if (t == "Travel Expenses") {
                t = "Travel"
            } else if (t == "") {
                return
            }
            t = t + d;
            this._showFormFragment(t);
            this.formatdate(a)
        },
        _formFragments: {},
        _showFormFragment: function (e) {
            var t = this.getView().byId("detailPage");
            t.removeAllContent();
            t.insertContent(this._getFormFragment(e))
        },
        _getFormFragment: function (e) {
            var t = this._formFragments[e];
            if (t) {
                return t
            }
            var t = sap.ui.xmlfragment(this.getView().getId(), "Gail.Medical_Claim.view." + e, this);
            this._formFragments[e] = t;
            return this._formFragments[e]
        },
        formatdate: function (e) {
            switch (e) {
                case "CON":
                    this.getView().byId("cClaimDate").setMaxDate(new Date);
                    break;
                case "MED":
                    this.getView().byId("mClaimDate").setMaxDate(new Date);
                    break;
                case "TST":
                    this.getView().byId("tClaimDate").setMaxDate(new Date);
                    break;
                case "HOS":
                    this.getView().byId("hDateFrom").setMaxDate(new Date);
                    this.getView().byId("hDateTo").setMaxDate(new Date);
                    break;
                case "TRV":
                    this.getView().byId("teDepDate").setMaxDate(new Date);
                    this.getView().byId("teArvlDate").setMaxDate(new Date);
                    break;
                case "OTH":
                    this.getView().byId("oClaimDate").setMaxDate(new Date);
                    break
            }
        },
        onchangeNextDate: function (e) {
            var t = this;
            var a = e.getSource();
            t._validateInput(a);
            var i = e.getSource().getProperty("dateValue");
            var s = e.getSource().getId().slice(53);
            switch (s) {
                case "hDateFrom":
                    this.getView().byId("hDateTo").setMinDate(i);
                    break;
                case "hDateFromE":
                    this.getView().byId("hDateToE").setMinDate(i);
                    break;
                case "teDepDate":
                    this.getView().byId("teArvlDate").setMinDate(i);
                    break;
                case "teDepDateE":
                    this.getView().byId("teArvlDateE").setMinDate(i);
                    break
            }
        },
        onConsultationTypeChange: function (e) {
            sap.ui.core.BusyIndicator.show(0);
            var t = e.getSource().getSelectedKey();
            var a = this.getOwnerComponent().getModel("InitialModel");
            if (t === "CD") {
                this.getView().byId("cReqAmt").setEditable(false);
                this.getView().byId("cReqAmt").setValue("0")
            } else {
                this.getView().byId("cReqAmt").setEditable(true);
                this.getView().byId("cReqAmt").setValue("")
            }
            var i = this;
            var s = [];
            var o = new sap.ui.model.Filter("Soval", sap.ui.model.FilterOperator.EQ, t);
            s.push(o);
            a.read("/F4_DOC_CATSet", {
                filters: s,
                success: function (e) {
                    sap.ui.core.BusyIndicator.hide();
                    var t = i.getOwnerComponent().getModel("docModel");
                    t.setData(e.results);
                    i.getView().byId("cDocCatalog").setModel(t, "docModel")
                },
                error: function (e) {
                    r.error("Error while loading doc Catalog.");
                    sap.ui.core.BusyIndicator.hide()
                }
            });
            if (t) {
                e.getSource().setValueState("None")
            } else {
                e.getSource().setValueState("Error")
            }
        },
        onConsultationTypeEdit: function (e) {
            sap.ui.core.BusyIndicator.show(0);
            var t = e.getSource().getSelectedKey();
            var a = this.getOwnerComponent().getModel("InitialModel");
            if (t === "CD") {
                this.getView().byId("cReqAmtE").setEditable(false);
                this.getView().byId("cReqAmtE").setValue("0")
            } else {
                this.getView().byId("cReqAmtE").setEditable(true);
                this.getView().byId("cReqAmtE").setValue("")
            }
            var i = this;
            var s = [];
            var o = new sap.ui.model.Filter("Soval", sap.ui.model.FilterOperator.EQ, t);
            s.push(o);
            a.read("/F4_DOC_CATSet", {
                filters: s,
                success: function (e) {
                    sap.ui.core.BusyIndicator.hide();
                    var t = i.getOwnerComponent().getModel("docModel");
                    t.setData(e.results);
                    i.getView().byId("cDocCatalogE").setModel(t, "docModel")
                },
                error: function (e) {
                    r.error("Error while loading doc Catalog.");
                    sap.ui.core.BusyIndicator.hide()
                }
            });
            if (t) {
                e.getSource().setValueState("None")
            } else {
                e.getSource().setValueState("Error")
            }
        },
        onOtherClaimTypeChange: function (e) {
            var t = e.getSource().getSelectedKey();
            if (t) {
                e.getSource().setValueState("None")
            } else {
                e.getSource().setValueState("Error")
            }
            if (t === "OT") {
                this.getView().byId("otherFreeText").setVisible(true);
                this.getView().byId("otherFreeText").setValue("")
            } else {
                this.getView().byId("otherFreeText").setVisible(false);
                this.getView().byId("otherFreeText").setValue("")
            }
        },
        onOtherClaimTypeChangeEdit: function (e) {
            var t = e.getSource().getSelectedKey();
            if (t) {
                e.getSource().setValueState("None")
            } else {
                e.getSource().setValueState("Error")
            }
            if (t === "OT") {
                this.getView().byId("otherFreeTextE").setVisible(true);
                this.getView().byId("otherFreeTextE").setValue("")
            } else {
                this.getView().byId("otherFreeTextE").setVisible(false);
                this.getView().byId("otherFreeTextE").setValue("")
            }
        },
        onSave: function () {
            let e = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
            var t = this.getOwnerComponent().getModel("detailMasterModel").getObject(g).C04t3;
            var a = false;
            var i = this;
            switch (t) {
                case "CON":
                    var s = this.getView().byId("covidRequestCons_edit").getSelectedKey();
                    var o = this.getView().byId("cConsultNumberE").getValue();
                    var l = o.charAt(0);
                    if (e.test(l)) {
                        sap.m.MessageBox.error("Bill Number can not start with special characters.");
                        return
                    }
                    if (e.test(o.charAt(o.length - 1))) {
                        sap.m.MessageBox.error("Bill Number can not end with special characters.");
                        return
                    }
                    var d = this.getView().byId("cClaimDateE").getProperty("dateValue");
                    var n = [
                        this.getView().byId("cPatientE"),
                        this.getView().byId("cClaimDateE"),
                        this.getView().byId("cPhysicianE"),
                        this.getView().byId("cConsultationTypeE"),
                        this.getView().byId("cDocCatalogE"),
                        this.getView().byId("cConsultNumberE"),
                        this.getView().byId("cOutStationE"),
                        this.getView().byId("cCityTypeE"),
                        this.getView().byId("cPlaceE"),
                        this.getView().byId("cReqAmtE")
                    ];
                    jQuery.each(n, function (e, t) {
                        a = i._validateInput(t) || a
                    });
                    if (a) {
                        r.alert("Please Fill All Input Fields.");
                        return
                    }
                    var h = new Date(d);
                    h.setMinutes(30);
                    h.setHours(5);
                    d = h;
                    this.getView().byId("cClaimDateE").setProperty("dateValue", d);
                    break;
                case "MED":
                    var s = this.getView().byId("covidRequestMed_edit").getSelectedKey();
                    var o = this.getView().byId("mCashMemoE").getValue();
                    var l = o.charAt(0);
                    if (e.test(l)) {
                        sap.m.MessageBox.error("Bill Number can not start with special characters.");
                        return
                    }
                    if (e.test(o.charAt(o.length - 1))) {
                        sap.m.MessageBox.error("Bill Number can not end with special characters.");
                        return
                    }
                    var d = this.getView().byId("mClaimDateE").getProperty("dateValue");
                    var n = [this.getView().byId("mPatientE"), this.getView().byId("mClaimDateE"), this.getView().byId("mCashMemoE"), this.getView().byId("mReqAmtE")];
                    jQuery.each(n, function (e, t) {
                        a = i._validateInput(t) || a
                    });
                    if (a) {
                        r.alert("Please Fill All Input Fields.");
                        return
                    }
                    var h = new Date(d);
                    h.setMinutes(30);
                    h.setHours(5);
                    d = h;
                    this.getView().byId("mClaimDateE").setProperty("dateValue", d);
                    break;
                case "TST":
                    var o = this.getView().byId("tCashMemoE").getValue();
                    var l = o.charAt(0);
                    if (e.test(l)) {
                        sap.m.MessageBox.error("Bill Number can not start with special characters.");
                        return
                    }
                    if (e.test(o.charAt(o.length - 1))) {
                        sap.m.MessageBox.error("Bill Number can not end with special characters.");
                        return
                    }
                    var d = this.getView().byId("tClaimDateE").getProperty("dateValue");
                    var c = this.getView().byId("tRecommendedE").getSelectedKey();
                    var n = [
                        this.getView().byId("tPatientE"),
                        this.getView().byId("tPatientE"),
                        this.getView().byId("tCashMemoE"),
                        this.getView().byId("tClinicNameE"),
                        this.getView().byId("tParticularsE"),
                        this.getView().byId("tEmpaneledE"),
                        this.getView().byId("tRecommendedE"),
                        this.getView().byId("tReqAmtE")
                    ];
                    jQuery.each(n, function (e, t) {
                        a = i._validateInput(t) || a
                    });
                    if (a) {
                        r.alert("Please Fill All Input Fields.");
                        return
                    }
                    var h = new Date(d);
                    h.setMinutes(30);
                    h.setHours(5);
                    d = h;
                    this.getView().byId("tClaimDateE").setProperty("dateValue", d);
                    if (c === "N") {
                        r.error("Claim cannot be submitted as it is not Recommended.", {
                            icon: r.Icon.ERROR,
                            title: "Alert"
                        });
                        return
                    }
                    break;
                case "HOS":
                    var s = this.getView().byId("covidRequestHos_edit").getSelectedKey();
                    var o = this.getView().byId("hCashMemoE").getValue();
                    var l = o.charAt(0);
                    if (e.test(l)) {
                        sap.m.MessageBox.error("Bill Number can not start with special characters.");
                        return
                    }
                    if (e.test(o.charAt(o.length - 1))) {
                        sap.m.MessageBox.error("Bill Number can not end with special characters.");
                        return
                    }
                    var y = this.getView().byId("hDateFromE").getProperty("dateValue");
                    var u = this.getView().byId("hDateToE").getProperty("dateValue");
                    var c = this.getView().byId("hRecommendedE").getSelectedKey();
                    var n = [
                        this.getView().byId("hPatientE"),
                        this.getView().byId("hDateFromE"),
                        this.getView().byId("hDateToE"),
                        this.getView().byId("hHospitalNameE"),
                        this.getView().byId("hCashMemoE"),
                        this.getView().byId("hTreatmentPlaceE"),
                        this.getView().byId("hEmpaneledE"),
                        this.getView().byId("hRecommendedE"),
                        this.getView().byId("hReqAmtE")
                    ];
                    jQuery.each(n, function (e, t) {
                        a = i._validateInput(t) || a
                    });
                    if (a) {
                        r.alert("Please Fill All Input Fields.");
                        return
                    }
                    if (c === "N") {
                        r.error("Claim cannot be submitted as it is not Recommended.", {
                            icon: r.Icon.ERROR,
                            title: "Alert"
                        });
                        return
                    }
                    var h = new Date(y);
                    h.setMinutes(30);
                    h.setHours(5);
                    y = h;
                    this.getView().byId("hDateFromE").setProperty("dateValue", y);
                    var o = new Date(u);
                    o.setMinutes(30);
                    o.setHours(5);
                    u = o;
                    this.getView().byId("hDateToE").setProperty("dateValue", u);
                    break;
                case "TRV":
                    var m = this.getView().byId("teDepDateE").getProperty("dateValue");
                    var V = this.getView().byId("teArvlDateE").getProperty("dateValue");
                    var c = this.getView().byId("teRecommendedE").getSelectedKey();
                    var n = [
                        this.getView().byId("tePatientE"),
                        this.getView().byId("teDepDateE"),
                        this.getView().byId("teDepPlaceE"),
                        this.getView().byId("teArvlDateE"),
                        this.getView().byId("teArvlPlaceE"),
                        this.getView().byId("teTravelModeE"),
                        this.getView().byId("teRecommendedE"),
                        this.getView().byId("teReqAmtE")
                    ];
                    jQuery.each(n, function (e, t) {
                        a = i._validateInput(t) || a
                    });
                    if (a) {
                        r.alert("Please Fill All Input Fields.");
                        return
                    }
                    if (c === "N") {
                        r.error("Claim cannot be submitted as it is not Recommended.", {
                            icon: r.Icon.ERROR,
                            title: "Alert"
                        });
                        return
                    }
                    var h = new Date(m);
                    h.setMinutes(30);
                    h.setHours(5);
                    m = h;
                    this.getView().byId("teDepDateE").setProperty("dateValue", m);
                    var o = new Date(V);
                    o.setMinutes(30);
                    o.setHours(5);
                    V = o;
                    this.getView().byId("teArvlDateE").setProperty("dateValue", V);
                    break;
                case "OTH":
                    var o = this.getView().byId("oCashMemoE").getValue();
                    var l = o.charAt(0);
                    if (e.test(l)) {
                        sap.m.MessageBox.error("Bill Number can not start with special characters.");
                        return
                    }
                    if (e.test(o.charAt(o.length - 1))) {
                        sap.m.MessageBox.error("Bill Number can not end with special characters.");
                        return
                    }
                    var d = this.getView().byId("oClaimDateE").getProperty("dateValue");
                    var c = this.getView().byId("oRecommendedE").getSelectedKey();
                    var n = [
                        this.getView().byId("oPatientE"),
                        this.getView().byId("oClaimDateE"),
                        this.getView().byId("oPhysicianE"),
                        this.getView().byId("oClaimTypeE"),
                        this.getView().byId("oCashMemoE"),
                        this.getView().byId("oParticularsE"),
                        this.getView().byId("oOutStationE"),
                        this.getView().byId("oCityTypeE"),
                        this.getView().byId("oPlaceE"),
                        this.getView().byId("oRecommendedE"),
                        this.getView().byId("otherFreeTextE"),
                        this.getView().byId("oReqAmtE")
                    ];
                    jQuery.each(n, function (e, t) {
                        a = i._validateInput(t) || a
                    });
                    if (a) {
                        r.alert("Please Fill All Input Fields.");
                        return
                    }
                    if (c === "N") {
                        r.error("Claim cannot be submitted as it is not Recommended.", {
                            icon: r.Icon.ERROR,
                            title: "Alert"
                        });
                        return
                    }
                    var h = new Date(d);
                    h.setMinutes(30);
                    h.setHours(5);
                    d = h;
                    this.getView().byId("oClaimDateE").setProperty("dateValue", d);
                    break
            }
            var w = this.getOwnerComponent().getModel("buttonsModel");
            w.setProperty("/dEdit", true);
            w.setProperty("/mAdd", true);
            w.setProperty("/mAttach", true);
            w.setProperty("/mDelete", true);
            if (sap.ui.Device.system.desktop) {
                this.ItemDisplay()
            } else {
                this.onCloseDetailPress();
                var w = this.getOwnerComponent().getModel("buttonsModel");
                w.setProperty("/dAdd", false);
                w.setProperty("/dSave", false);
                w.setProperty("/dClear", false);
                w.setProperty("/dSelect", false)
            }
        },
        onEdit: function (e) {
            var t = n + "Edit";
            var a = this.getView().byId("detailPage");
            a.removeAllContent();
            var i = this._formFragments[t];
            if (i) {
                a.insertContent(i)
            } else {
                var i = sap.ui.xmlfragment(this.getView().getId(), "Gail.Medical_Claim.view." + t, this);
                this._formFragments[t] = i;
                a.insertContent(this._formFragments[t])
            }
            var s = this.getView().byId("form" + t);
            s.bindElement("detailMasterModel>" + g);
            switch (n) {
                case "Consultation":
                    sap.ui.core.BusyIndicator.show(0);
                    this.getView().byId("cClaimDateE").setMaxDate(new Date);
                    var o = this.getView().byId("cConsultationTypeE").getSelectedKey();
                    var l = this;
                    var d = [];
                    var h = new sap.ui.model.Filter("Soval", sap.ui.model.FilterOperator.EQ, o);
                    d.push(h);
                    var c = this.getOwnerComponent().getModel("InitialModel");
                    c.read("/F4_DOC_CATSet", {
                        filters: d,
                        success: function (e) {
                            sap.ui.core.BusyIndicator.hide();
                            var a = l.getOwnerComponent().getModel("docModel");
                            a.setData(e.results);
                            var i = l.getView().byId("form" + t);
                            i.unbindElement("detailMasterModel");
                            i.bindElement("detailMasterModel>" + g)
                        },
                        error: function (e) {
                            r.error("Error while loading doc Catalog.");
                            sap.ui.core.BusyIndicator.hide()
                        }
                    });
                    break;
                case "Medicines":
                    this.getView().byId("mClaimDateE").setMaxDate(new Date);
                    break;
                case "Tests":
                    this.getView().byId("tClaimDateE").setMaxDate(new Date);
                    break;
                case "Hospitalization":
                    this.getView().byId("hDateFromE").setMaxDate(new Date);
                    this.getView().byId("hDateToE").setMaxDate(new Date);
                    break;
                case "Travel":
                    this.getView().byId("teDepDateE").setMaxDate(new Date);
                    this.getView().byId("teArvlDateE").setMaxDate(new Date);
                    break;
                case "Others":
                    this.getView().byId("oClaimDateE").setMaxDate(new Date);
                    break
            }
            var y = this.getOwnerComponent().getModel("buttonsModel");
            y.setProperty("/dAdd", false);
            y.setProperty("/dSave", true);
            y.setProperty("/dClear", false);
            y.setProperty("/dEdit", false);
            y.setProperty("/dSelect", false);
            y.setProperty("/mAdd", false);
            y.setProperty("/mAttach", false);
            y.setProperty("/mDelete", false)
        },
        clearData: function () {
            var e = this.getView().byId("itemName").getSelectedKey();
            switch (e) {
                case "CON":
                    this.getView().byId("cPatient").setSelectedKey("");
                    this.getView().byId("cClaimDate").setValue("");
                    this.getView().byId("cPhysician").setValue("");
                    this.getView().byId("cConsultationType").setSelectedKey("");
                    this.getView().byId("cDocCatalog").setSelectedKey("");
                    this.getView().byId("cConsultNumber").setValue("");
                    this.getView().byId("cOutStation").setSelectedKey("");
                    this.getView().byId("cCityType").setSelectedKey("");
                    this.getView().byId("cPlace").setValue("");
                    this.getView().byId("cReqAmt").setValue("");
                    break;
                case "MED":
                    this.getView().byId("mPatient").setSelectedKey("");
                    this.getView().byId("mClaimDate").setValue("");
                    this.getView().byId("mCashMemo").setValue("");
                    this.getView().byId("mParticulars").setValue("");
                    this.getView().byId("mReqAmt").setValue("");
                    break;
                case "TST":
                    this.getView().byId("tPatient").setSelectedKey("");
                    this.getView().byId("tClaimDate").setValue("");
                    this.getView().byId("tCashMemo").setValue("");
                    this.getView().byId("tClinicName").setValue("");
                    this.getView().byId("tParticulars").setValue("");
                    this.getView().byId("tEmpaneled").setSelectedKey("");
                    this.getView().byId("tRecommended").setSelectedKey("");
                    this.getView().byId("tReqAmt").setValue("");
                    break;
                case "HOS":
                    this.getView().byId("hPatient").setSelectedKey("");
                    this.getView().byId("hDateFrom").setValue("");
                    this.getView().byId("hDateTo").setValue("");
                    this.getView().byId("hHospitalName").setValue("");
                    this.getView().byId("hCashMemo").setValue("");
                    this.getView().byId("hTreatmentPlace").setValue("");
                    this.getView().byId("hEmpaneled").setSelectedKey("");
                    this.getView().byId("hRecommended").setSelectedKey("");
                    this.getView().byId("hReqAmt").setValue("");
                    break;
                case "TRV":
                    this.getView().byId("tePatient").setSelectedKey("");
                    this.getView().byId("teDepDate").setValue("");
                    this.getView().byId("teDepPlace").setValue("");
                    this.getView().byId("teArvlDate").setValue("");
                    this.getView().byId("teArvlPlace").setValue("");
                    this.getView().byId("teTravelMode").setValue("");
                    this.getView().byId("teReqAmt").setValue("");
                    break;
                case "OTH":
                    this.getView().byId("oPatient").setSelectedKey("");
                    this.getView().byId("oClaimDate").setValue("");
                    this.getView().byId("oCashMemo").setValue("");
                    this.getView().byId("oPhysician").setValue("");
                    this.getView().byId("oClaimType").setSelectedKey("");
                    this.getView().byId("oParticulars").setValue("");
                    this.getView().byId("oOutStation").setSelectedKey("");
                    this.getView().byId("oCityType").setSelectedKey("");
                    this.getView().byId("oPlace").setValue("");
                    this.getView().byId("oRecommended").setSelectedKey("Yes");
                    this.getView().byId("otherFreeText").setValue("");
                    this.getView().byId("oReqAmt").setValue("");
                    break
            }
        },
        _validateInput: function (e) {
            var t = "None";
            var a = false;
            var i = e.getMetadata().getName();
            if (! e.getVisible()) 
                return;
            
            if (i === "sap.m.Select") {
                if (! e.getSelectedKey()) {
                    t = "Error";
                    a = true
                }
            } else if (i === "sap.m.Input") {
                if (! e.getValue()) {
                    t = "Error";
                    a = true
                }
            } else if (i === "sap.m.DatePicker") {
                if (! e.getValue()) {
                    t = "Error";
                    a = true
                }
            }
            e.setValueState(t);
            return a
        },
        ontextChange: function (e) {
            var t = this;
            var a = e.getSource();
            t._validateInput(a)
        },
        onOpenPrevReq: function (e) {
            var t = this.getOwnerComponent().getModel("prevBills");
            t.setData(e);
            sap.ui.getCore().setModel(t, "PrevBills");
            if (e.length > 0) {
                if (this._prevBill === null || typeof this._prevBill === "undefined") {
                    this._prevBill = sap.ui.xmlfragment("Gail.Medical_Claim.view.prevBill", this)
                }
                this._prevBill.open()
            } else {
                this.onAddItem()
            }
        },
        checkBoxEventHandler: function (e) {
            var t = sap.ui.getCore().byId("PrevCheckBox");
            var a = sap.ui.getCore().byId("btnAccept");
            if (t.getSelected()) 
                a.setVisible(true);
             else 
                a.setVisible(false)
            
        },
        onPrevBillCheck: function () {
            var e = this.getView().byId("itemName").getSelectedKey();
            let t = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
            var e = this.getView().byId("itemName").getSelectedKey();
            var a = false;
            var i = this;
            switch (e) {
                case "": r.show("Please select an Item to Add!", {title: "Dear User"});
                    return;
                    break;
                case "CON":
                    var s = this.getView().byId("cConsultNumber").getValue();
                    var o = s.charAt(0);
                    if (t.test(o)) {
                        sap.m.MessageBox.error("Bill Number can not start with special characters.");
                        return
                    }
                    if (t.test(s.charAt(s.length - 1))) {
                        sap.m.MessageBox.error("Bill Number can not end with special characters.");
                        return
                    }
                    var l = [
                        this.getView().byId("cPatient"),
                        this.getView().byId("cClaimDate"),
                        this.getView().byId("cPhysician"),
                        this.getView().byId("cConsultationType"),
                        this.getView().byId("cDocCatalog"),
                        this.getView().byId("cConsultNumber"),
                        this.getView().byId("cOutStation"),
                        this.getView().byId("cCityType"),
                        this.getView().byId("cPlace"),
                        this.getView().byId("cReqAmt"),
                        this.getView().byId("covidRequestCons_create")
                    ];
                    jQuery.each(l, function (e, t) {
                        a = i._validateInput(t) || a
                    });
                    if (a) {
                        r.alert("Please Fill All Input Fields.");
                        return
                    }
                    var d = this.getView().byId("cPatient").getSelectedKey();
                    var n = this.getView().byId("cClaimDate").getProperty("dateValue");
                    break;
                case "MED":
                    var d = this.getView().byId("mPatient").getSelectedKey();
                    var n = this.getView().byId("mClaimDate").getProperty("dateValue");
                    var g = this.getView().byId("mCashMemo").getValue();
                    var o = g.charAt(0);
                    if (t.test(o)) {
                        sap.m.MessageBox.error("Bill Number can not start with special characters.");
                        return
                    }
                    if (t.test(g.charAt(g.length - 1))) {
                        sap.m.MessageBox.error("Bill Number can not end with special characters.");
                        return
                    }
                    var l = [
                        this.getView().byId("mPatient"),
                        this.getView().byId("mClaimDate"),
                        this.getView().byId("mCashMemo"),
                        this.getView().byId("mReqAmt"),
                        this.getView().byId("covidRequestMed_create")
                    ];
                    jQuery.each(l, function (e, t) {
                        a = i._validateInput(t) || a
                    });
                    if (a) {
                        r.alert("Please Fill All Input Fields.");
                        return
                    }
                    break;
                case "TST":
                    var d = this.getView().byId("tPatient").getSelectedKey();
                    var n = this.getView().byId("tClaimDate").getProperty("dateValue");
                    var g = this.getView().byId("tCashMemo").getValue();
                    var o = g.charAt(0);
                    if (t.test(o)) {
                        sap.m.MessageBox.error("Bill Number can not start with special characters.");
                        return
                    }
                    if (t.test(g.charAt(g.length - 1))) {
                        sap.m.MessageBox.error("Bill Number can not end with special characters.");
                        return
                    }
                    var l = [
                        this.getView().byId("tPatient"),
                        this.getView().byId("tClaimDate"),
                        this.getView().byId("tCashMemo"),
                        this.getView().byId("tClinicName"),
                        this.getView().byId("tParticulars"),
                        this.getView().byId("tEmpaneled"),
                        this.getView().byId("tRecommended"),
                        this.getView().byId("tReqAmt")
                    ];
                    jQuery.each(l, function (e, t) {
                        a = i._validateInput(t) || a
                    });
                    if (a) {
                        r.alert("Please Fill All Input Fields.");
                        return
                    }
                    break;
                case "HOS":
                    var d = this.getView().byId("hPatient").getSelectedKey();
                    var h = this.getView().byId("hDateFrom").getProperty("dateValue");
                    var n = this.getView().byId("hDateFrom").getProperty("dateValue");
                    var c = this.getView().byId("hDateTo").getProperty("dateValue");
                    var y = this.getView().byId("hHospitalName").getValue();
                    var g = this.getView().byId("hCashMemo").getValue();
                    var u = this.getView().byId("covidRequestHos_create").getSelectedKey();
                    var o = g.charAt(0);
                    if (t.test(o)) {
                        sap.m.MessageBox.error("Bill Number can not start with special characters.");
                        return
                    }
                    if (t.test(g.charAt(g.length - 1))) {
                        sap.m.MessageBox.error("Bill Number can not end with special characters.");
                        return
                    }
                    var m = this.getView().byId("hTreatmentPlace").getValue();
                    var V = this.getView().byId("hEmpaneled").getSelectedKey();
                    var w = this.getView().byId("hRecommended").getSelectedKey();
                    var b = this.getView().byId("hReqAmt").getValue();
                    var I = this.getView().byId("hTaxExmp").getSelectedKey();
                    var l = [
                        this.getView().byId("hPatient"),
                        this.getView().byId("hDateFrom"),
                        this.getView().byId("hDateTo"),
                        this.getView().byId("hHospitalName"),
                        this.getView().byId("hCashMemo"),
                        this.getView().byId("hTreatmentPlace"),
                        this.getView().byId("hEmpaneled"),
                        this.getView().byId("hRecommended"),
                        this.getView().byId("hReqAmt"),
                        this.getView().byId("hTaxExmp"),
                        this.getView().byId("covidRequestHos_create")
                    ];
                    jQuery.each(l, function (e, t) {
                        a = i._validateInput(t) || a
                    });
                    if (a) {
                        r.alert("Please Fill All Input Fields.");
                        return
                    }
                    break;
                case "TRV":
                    var l = [
                        this.getView().byId("tePatient"),
                        this.getView().byId("teDepDate"),
                        this.getView().byId("teDepPlace"),
                        this.getView().byId("teArvlDate"),
                        this.getView().byId("teArvlPlace"),
                        this.getView().byId("teTravelMode"),
                        this.getView().byId("teRecommended"),
                        this.getView().byId("teReqAmt")
                    ];
                    jQuery.each(l, function (e, t) {
                        a = i._validateInput(t) || a
                    });
                    if (a) {
                        r.alert("Please Fill All Input Fields.");
                        return
                    }
                    break;
                case "OTH":
                    var d = this.getView().byId("oPatient").getSelectedKey();
                    var n = this.getView().byId("oClaimDate").getProperty("dateValue");
                    var p = this.getView().byId("oPhysician").getValue();
                    var v = this.getView().byId("oClaimType").getSelectedKey();
                    var g = this.getView().byId("oCashMemo").getValue();
                    var o = g.charAt(0);
                    if (t.test(o)) {
                        sap.m.MessageBox.error("Bill Number can not start with special characters.");
                        return
                    }
                    if (t.test(g.charAt(g.length - 1))) {
                        sap.m.MessageBox.error("Bill Number can not end with special characters.");
                        return
                    }
                    var l = [
                        this.getView().byId("oPatient"),
                        this.getView().byId("oClaimDate"),
                        this.getView().byId("oPhysician"),
                        this.getView().byId("oClaimType"),
                        this.getView().byId("oCashMemo"),
                        this.getView().byId("oParticulars"),
                        this.getView().byId("oOutStation"),
                        this.getView().byId("oCityType"),
                        this.getView().byId("oPlace"),
                        this.getView().byId("oRecommended"),
                        this.getView().byId("otherFreeText"),
                        this.getView().byId("oReqAmt")
                    ];
                    jQuery.each(l, function (e, t) {
                        a = i._validateInput(t) || a
                    });
                    if (a) {
                        r.alert("Please Fill All Input Fields.");
                        return
                    }
                    break
            }
            if (e == "TRV") {
                this.onAddItem()
            } else {
                var C = "";
                var P = "";
                var M = n.getMonth() + 1;
                if (M <= 9) {
                    P = "0" + M.toString()
                } else {
                    P = M.toString()
                }
                if (n.getDate() <= 9) {
                    C = "0" + n.getDate().toString()
                } else {
                    C = n.getDate().toString()
                }
                var f = n.getFullYear() + P + C;
                var D = [];
                var E = [
                    new sap.ui.model.Filter("Retyp", sap.ui.model.FilterOperator.EQ, e),
                    new sap.ui.model.Filter("fcnam", sap.ui.model.FilterOperator.EQ, d),
                    new sap.ui.model.Filter("CDT01", sap.ui.model.FilterOperator.EQ, f)
                ];
                var S = new sap.ui.model.Filter(E, true);
                D.push(S);
                var A = this;
                this.getOwnerComponent().getModel("InitialModel").read("/PREV_BILLSet", {
                    filters: D,
                    success: function (e) {
                        A.onOpenPrevReq(e.results)
                    },
                    error: function (e) {
                        sap.ui.core.BusyIndicator.hide();
                        l.show("Error Connecting odata service to backend")
                    }
                })
            }
        },
        onContinuePrevReq: function (e) {
            this._prevBill.close();
            this.onAddItem()
        },
        onPrevBillDialog: function (e) {
            sap.ui.core.BusyIndicator.hide();
            this._prevBill.close()
        },
        onAddItem: function () {
            let e = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
            var t = this.getView().byId("itemName").getSelectedKey();
            var a = false;
            var i = this;
            switch (t) {
                case "": r.show("Please select an Item to Add!", {title: "Dear User"});
                    return;
                    break;
                case "CON":
                    var s = this.getView().byId("cConsultNumber").getValue();
                    var o = this.getView().byId("covidRequestCons_create").getSelectedKey();
                    var d = this.getView().byId("cPatient").getSelectedKey();
                    var n = this.getView().byId("cClaimDate").getProperty("dateValue");
                    var g = this.getView().byId("cPhysician").getValue();
                    var h = this.getView().byId("cConsultationType").getSelectedKey();
                    var c = this.getView().byId("cDocCatalog").getSelectedKey();
                    var s = this.getView().byId("cConsultNumber").getValue();
                    var y = this.getView().byId("cOutStation").getSelectedKey();
                    var u = this.getView().byId("cCityType").getSelectedKey();
                    var m = this.getView().byId("cPlace").getValue();
                    var V = this.getView().byId("cReqAmt").getValue();
                    var w = new Date(n);
                    w.setMinutes(30);
                    w.setHours(5);
                    n = w;
                    var b = {
                        C04t3: "CON",
                        Fcnam: d,
                        Famsa: "",
                        Fasex: "",
                        Favor: "",
                        Fanam: "",
                        Age: "",
                        Cdt01: n,
                        ConsultNo: s,
                        Physician: g,
                        Place: m,
                        CityType: u,
                        Outstation: y,
                        OutstationTxt: "",
                        Empaneled: "",
                        Recommended: "",
                        C04t4: h,
                        C04t5: c,
                        C04t4Txt: "",
                        C04t5Txt: "",
                        Rqamt: V,
                        Apamt: "0",
                        C10t3: o
                    };
                    l.push(b);
                    break;
                case "MED":
                    var d = this.getView().byId("mPatient").getSelectedKey();
                    var n = this.getView().byId("mClaimDate").getProperty("dateValue");
                    var I = this.getView().byId("mCashMemo").getValue();
                    var u = this.getView().byId("covidRequestMed_create").getSelectedKey();
                    var p = this.getView().byId("mParticulars").getValue();
                    var V = this.getView().byId("mReqAmt").getValue();
                    var w = new Date(n);
                    w.setMinutes(30);
                    w.setHours(5);
                    n = w;
                    var b = {
                        C04t3: "MED",
                        Fcnam: d,
                        Famsa: "",
                        Fasex: "",
                        Favor: "",
                        Fanam: "",
                        Age: "",
                        Cdt01: n,
                        ConsultNo: I,
                        Particulars: p,
                        Rqamt: V,
                        Apamt: "0",
                        C10t3: u
                    };
                    l.push(b);
                    var v = this.getView().getModel("InitialModel");
                    var i = 0;
                    var C = this;
                    var P = this.getOwnerComponent().getModel("invoiceDate");
                    var M = this.getView().byId("mClaimDate").getProperty("dateValue");
                    var f = {
                        invoiceDate: M
                    };
                    P.setData(f);
                    sap.ui.getCore().setModel(P, "invoiceDate");
                    v.read("/EMP_FAMILY_DETAILSSet", {
                        success: function (e) {
                            var t = e.results;
                            t.forEach(function () {
                                if (t[i].TEXT === b.Fcnam) {
                                    b.Fasex = t[i].FASEX;
                                    b.Famsa = t[i].FAMSA;
                                    b.Age = t[i].AGE
                                }
                                i = i + 1
                            });
                            var a = C.getOwnerComponent().getModel("empFamDetails");
                            a.setData(e.results)
                        },
                        error: function (e) {
                            alert("Error")
                        }
                    });
                    break;
                case "TST":
                    var d = this.getView().byId("tPatient").getSelectedKey();
                    var n = this.getView().byId("tClaimDate").getProperty("dateValue");
                    var I = this.getView().byId("tCashMemo").getValue();
                    var D = this.getView().byId("tClinicName").getValue();
                    var p = this.getView().byId("tParticulars").getValue();
                    var E = this.getView().byId("tEmpaneled").getSelectedKey();
                    var S = this.getView().byId("tRecommended").getSelectedKey();
                    var V = this.getView().byId("tReqAmt").getValue();
                    var w = new Date(n);
                    w.setMinutes(30);
                    w.setHours(5);
                    n = w;
                    if (S === "N") {
                        r.error("Claim cannot be submitted as it is not Recommended.", {
                            icon: r.Icon.ERROR,
                            title: "Alert"
                        });
                        return
                    }
                    var b = {
                        C04t3: "TST",
                        Fcnam: d,
                        Famsa: "",
                        Fasex: "",
                        Favor: "",
                        Fanam: "",
                        Age: "",
                        Cdt01: n,
                        ConsultNo: I,
                        ClinicName: D,
                        Particulars: p,
                        Empaneled: E,
                        Recommended: S,
                        Rqamt: V,
                        Apamt: "0"
                    };
                    l.push(b);
                    break;
                case "HOS":
                    var d = this.getView().byId("hPatient").getSelectedKey();
                    var A = this.getView().byId("hDateFrom").getProperty("dateValue");
                    var R = this.getView().byId("hDateTo").getProperty("dateValue");
                    var F = this.getView().byId("hHospitalName").getValue();
                    var I = this.getView().byId("hCashMemo").getValue();
                    var u = this.getView().byId("covidRequestHos_create").getSelectedKey();
                    var T = this.getView().byId("hTreatmentPlace").getValue();
                    var E = this.getView().byId("hEmpaneled").getSelectedKey();
                    var S = this.getView().byId("hRecommended").getSelectedKey();
                    var V = this.getView().byId("hReqAmt").getValue();
                    var O = this.getView().byId("hTaxExmp").getSelectedKey();
                    if (S === "N") {
                        r.error("Claim cannot be submitted as it is not Recommended.", {
                            icon: r.Icon.ERROR,
                            title: "Alert"
                        });
                        return
                    }
                    var w = new Date(A);
                    w.setMinutes(30);
                    w.setHours(5);
                    A = w;
                    var w = new Date(R);
                    w.setMinutes(30);
                    w.setHours(5);
                    R = w;
                    var b = {
                        C04t3: "HOS",
                        Fcnam: d,
                        Famsa: "",
                        Fasex: "",
                        Favor: "",
                        Fanam: "",
                        Age: "",
                        Cdt01: A,
                        Cdt02: R,
                        ConsultNo: I,
                        ClinicName: F,
                        Place: T,
                        Empaneled: E,
                        Recommended: S,
                        Rqamt: V,
                        Apamt: "0",
                        C10t1: O,
                        C10t3: u
                    };
                    l.push(b);
                    break;
                case "TRV":
                    var d = this.getView().byId("tePatient").getSelectedKey();
                    var x = this.getView().byId("teDepDate").getProperty("dateValue");
                    var N = this.getView().byId("teDepPlace").getValue();
                    var B = this.getView().byId("teArvlDate").getProperty("dateValue");
                    var K = this.getView().byId("teArvlPlace").getValue();
                    var _ = this.getView().byId("teTravelMode").getSelectedKey();
                    var S = this.getView().byId("teRecommended").getSelectedKey();
                    var V = this.getView().byId("teReqAmt").getValue();
                    if (S === "N") {
                        r.error("Claim cannot be submitted as it is not Recommended.", {
                            icon: r.Icon.ERROR,
                            title: "Alert"
                        });
                        return
                    }
                    var w = new Date(x);
                    w.setMinutes(30);
                    w.setHours(5);
                    x = w;
                    var w = new Date(B);
                    w.setMinutes(30);
                    w.setHours(5);
                    B = w;
                    var b = {
                        C04t3: "TRV",
                        Fcnam: d,
                        Famsa: "",
                        Fasex: "",
                        Favor: "",
                        Fanam: "",
                        Age: "",
                        Cdt01: x,
                        Cdt02: B,
                        DepPlace: N,
                        ArrPlace: K,
                        TravelMode: _,
                        Recommended: S,
                        Rqamt: V,
                        Apamt: "0"
                    };
                    l.push(b);
                    if (S === "Y") {
                        r.information("Please attach requisities supporting documents permitted by HR.", {
                            icon: r.Icon.INFORMATION,
                            title: "Information"
                        })
                    }
                    break;
                case "OTH":
                    var d = this.getView().byId("oPatient").getSelectedKey();
                    var n = this.getView().byId("oClaimDate").getProperty("dateValue");
                    var g = this.getView().byId("oPhysician").getValue();
                    var k = this.getView().byId("oClaimType").getSelectedKey();
                    var I = this.getView().byId("oCashMemo").getValue();
                    var p = this.getView().byId("oParticulars").getValue();
                    var y = this.getView().byId("oOutStation").getSelectedKey();
                    var u = this.getView().byId("oCityType").getSelectedKey();
                    var m = this.getView().byId("oPlace").getValue();
                    var S = this.getView().byId("oRecommended").getSelectedKey();
                    var q = this.getView().byId("otherFreeText").getValue();
                    var V = this.getView().byId("oReqAmt").getValue();
                    if (S === "N") {
                        r.error("Claim cannot be submitted as it is not Recommended.", {
                            icon: r.Icon.ERROR,
                            title: "Alert"
                        });
                        return
                    }
                    var w = new Date(n);
                    w.setMinutes(30);
                    w.setHours(5);
                    n = w;
                    var b = {
                        C04t3: "OTH",
                        Fcnam: d,
                        Famsa: "",
                        Fasex: "",
                        Favor: "",
                        Fanam: "",
                        Age: "",
                        Cdt01: n,
                        ConsultNo: I,
                        ClinicName: g,
                        Place: m,
                        CityType: u,
                        Outstation: y,
                        Particulars: p,
                        Empaneled: "",
                        Recommended: S,
                        C10t2: k,
                        C04t5: "",
                        Rqamt: V,
                        Apamt: "0",
                        C10t1: O,
                        C80t1: q
                    };
                    l.push(b);
                    break
            }
            var H = this.getOwnerComponent().getModel("detailMasterModel");
            H.setData(l);
            this.clearData();
            this.getView().byId("itemName").setSelectedKey("");
            if (sap.ui.Device.system.desktop) {
                var j = this.getView().byId("detailPage");
                j.removeAllContent();
                var Q = this.getOwnerComponent().getModel("buttonsModel");
                Q.setProperty("/mAdd", false);
                Q.setProperty("/mAttach", true);
                Q.setProperty("/showEdit", true)
            } else {
                var Q = this.getOwnerComponent().getModel("buttonsModel");
                Q.setProperty("/mAdd", true);
                Q.setProperty("/mAttach", true);
                Q.setProperty("/showEdit", true);
                this.onCloseDetailPress()
            }
        },
        onCloseDetailPress: function () {
            var e = this.getView().byId("detailPage");
            e.removeAllContent();
            this.getModel("appView").setProperty("/layout", "OneColumn");
            var t = "0";
            this.getOwnerComponent().getRouter().navTo("master", {claimId: t})
        },
        OnTaxSelection: function (e) {
            var t = e.getParameter("selectedItem").getText();
            var a = e.getSource().getProperty("selectedKey");
            if (a == "Yes") {
                var i = !!this.getView().$().closest(".sapUiSizeCompact").length;
                sap.m.MessageBox.information("Please attached requisite supporting document(s) for Tax exemption.", {
                    styleClass: i ? "sapUiSizeCompact" : ""
                })
            }
        },
        onDeleteM: function (e) {
            var t = this.getView().byId("form" + n + "Display").getElementBinding("detailMasterModel").getPath();
            t = t.toString();
            t = t.slice(1);
            var a = parseInt(t);
            var i = a - 1;
            i = i.toString();
            i = "/" + i;
            var s = this.getOwnerComponent().getModel("detailMasterModel").oData;
            var o = s.length;
            if (o == t || ! t) {
                r.information("Please select a record to delete!", {title: "Alert"});
                return
            }
            s.splice(t, 1);
            this.getOwnerComponent().getModel("detailMasterModel").setData(s);
            if (s.length === 0) {
                var l = this.getOwnerComponent().getModel("buttonsModel");
                l.setProperty("/mDelete", false);
                l.setProperty("/mAttach", false);
                l.setProperty("/dEdit", false)
            }
            this.onCloseDetailPress()
        },
        toggleFullScreen: function () {
            var e = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", ! e);
            if (! e) {
                this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
                this.getModel("appView").setProperty("/layout", "MidColumnFullScreen")
            } else {
                this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"))
            }
        },
        onLiveReqAmt: function (e) {
            var t = e.getParameter("value").length;
            var a = this.getView().byId("addBtn");
            var i = this.getView().byId("saveBtn");
            var s = e.getParameter("id");
            if (t > 10) {
                this.getView().byId(s).setValueState(sap.ui.core.ValueState.Error);
                a.setEnabled(false);
                i.setEnabled(false)
            } else {
                this.getView().byId(s).setValueState(sap.ui.core.ValueState.None);
                a.setEnabled(true);
                i.setEnabled(true)
            }
        }
    })
});
// # sourceMappingURL=Detail.controller.js.map
