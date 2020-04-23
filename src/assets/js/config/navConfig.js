var svgConstants = require('../constants/svgConstants');

var navData = {
    "utility": [
        [{
            "screen_id": "pptl_management",
            "code": "CLIENTCODE_004",
            "image": svgConstants.pptl,
            "message": "Unexpected Item",
            "showImage": true,
            "level": null,
            "type": 'active'
        }],
        [{
            "screen_id": "scanner_management",
            "code": "CLIENTCODE_005",
            "image": svgConstants.scanner,
            "message": "Unexpected Item",
            "showImage": true,
            "level": null,
            "type": 'active'
        }]
    ],
    "putBack": [
        [{
            "screen_id": "put_back_invalid_tote_item",
            "code": "Common.000",
            "image": svgConstants.exception,
            "message": "Unexpected Item",
            "showImage": true,
            "level": null,
            "type": 'active'
        }],
        [{
            "screen_id": ["put_back_stage", "put_back_scan_tote"],
            "code": "Common.000",
            "image": svgConstants.stage,
            "message": "Stage Bin or Scan Item",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": ["put_back_scan", "put_back_tote_close"],
            "code": "Common.001",
            "image": svgConstants.scan,
            "message": "Scan & Confirm",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }], [
            {
                "screen_id": ["put_back_warehouse_full_irt_scan", "put_back_no_scan"],
                "code": "PtF.H.015",
                "message": "Put item into IRT bin and scan the bin",
                "showImage": false,
                "level": 1,
                "type": 'active'
            }],
        [{
            "screen_id": ["put_back_stage", "put_back_scan_tote"],
            "code": "Common.000",
            "image": svgConstants.stage,
            "message": "Stage Bin or Scan Item",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": ["put_back_scan", "put_back_tote_close"],
            "code": "Common.001",
            "image": svgConstants.scan,
            "message": "Press PPTL",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }],
        [{
            "screen_id": ["put_back_stage", "put_back_scan_tote"],
            "code": "Common.000",
            "image": svgConstants.stage,
            "message": "Scan",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": ["put_back_pptl_press_tote"],
            "code": "Common.001",
            "image": svgConstants.scan,
            "message": "Press PPTL",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }], [{
            "screen_id": ["put_back_no_scan_tote"],
            "code": "PtB.H.020",
            "image": svgConstants.stage,
            "message": "Scan",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }]

    ],
    "putFront": [

        [{
            "screen_id": "put_front_waiting_for_rack",
            "code": "Common.000",
            "message": "Wait For MSU",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [{
            "screen_id": "put_front_scan",
            "code": "Common.000",
            "image": svgConstants.scan,
            "message": "Scan Item From Bin",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "put_front_place_items_in_rack",
            "code": "Common.001",
            "image": svgConstants.rack,
            "message": "Place Item in slot and scan more",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }],
        [{
            "screen_id": "put_front_waiting_undock",
            "code": "Common.000",
            "message": "Undock Roll Cage if no items remaining",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [{
            "screen_id": "put_front_pptl_press",
            "code": "Common.000",
            "message": "Place the tote back in bin {0} and press pptl",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [{
            "screen_id": "put_front_place_unmarked_entity_in_rack",
            "code": "Common.000",
            "message": "Place",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "put_front_scan_rack_for_unmarked_entity",
            "code": "Common.001",
            "message": "Scan slot",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }],
        [{
            "screen_id": "put_front_exception_warehouse_full",
            "code": "PtF.H.015",
            "message": "Warehouse Full",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [{
            "screen_id": "put_front_wrong_undock",
            "code": "PtF.H.017",
            "message": "Wrong Undock",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }], [{
            "screen_id": "put_front_bin_warehouse_full",
            "code": "PtF.H.016",
            "message": "Warehouse Full",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [{
            "screen_id": "put_front_warehouse_full_irt_scan",
            "code": "PtF.H.021",
            "message": "Scan IRT Bin",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [{
            "screen_id": "ud_put_front_tote_scan",
            "code": "Common.000",
            "message": "Wait For MSU",
            "showImage": true,
            "level": 1,
            "type": 'active'
        }, {
            "screen_id": "",
            "code": "Common.000",
            "message": "Put and confirm",
            "showImage": false,
            "level": 2,
            "type": 'passive'
        }],
        [{
            "screen_id": "",
            "code": "Common.000",
            "message": "Dock Cart",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "ud_put_front_entity_scan",
            "code": "Common.000",
            "message": "Put and confirm",
            "showImage": true,
            "level": 2,
            "type": 'true'
        }],
        [{
            "screen_id": "ud_put_front_bin_scan",
            "code": "Common.000",
            "message": "Scan PPS Bin Barcode",
            "showImage": true,
            "level": 1,
            "type": 'active'
        }, {
            "screen_id": "",
            "code": "Common.000",
            "message": "Put and confirm",
            "showImage": false,
            "level": 2,
            "type": 'passive'
        }],
        [{
            "screen_id": "ud_put_front_waiting_for_rack",
            "code": "UD.H.005",
            "message": "Wait for MSU",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [{
            "screen_id": "",
            "code": "Common.018",
            "message": "Dock Cart",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "ud_put_front_place_items_in_rack",
            "code": "UD.H.004",
            "message": "Put item in slot and scan slot to confirm",
            "showImage": true,
            "level": 2,
            "type": 'active'
        }],
        [{
            "screen_id": "",
            "code": "Common.018",
            "message": "Dock Cart",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "ud_put_front_missing",
            "code": "UD.H.004",
            "message": "Put item in slot and scan slot to confirm",
            "showImage": true,
            "level": 2,
            "type": 'active'
        }],
        [{
            "screen_id": "",
            "code": "Common.018",
            "message": "Dock Cart",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "ud_put_front_unexpected",
            "code": "UD.H.004",
            "message": "Put item in slot and scan slot to confirm",
            "showImage": true,
            "level": 2,
            "type": 'active'
        }]


    ],
    "pickFront": [
        [{
            "screen_id": ["pick_front_waiting_for_msu", "pick_front_one_step_scan", "pick_front_dock_tote", "pick_front_undock_tote", "pick_front_slot_scan", "pick_front_tote_confirm", "remove_all_totes", "wait_for_mtu", "select_mtu_point", "scan_empty_tote","scan_empty_slot"],
            "code": "Common.000",
            "message": "Wait For MSU",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [{
            "screen_id": ["pick_front_location_scan", "pick_front_container_scan", "pick_front_item_scan", "pick_front_more_item_scan", "pick_front_container_break", "pick_front_checklist", "pick_front_skip_tote", "pick_front_skip_bin"],
            "code": "Common.000",
            "image": svgConstants.scan,
            "message": "Scan Slot Barcode",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "pick_front_pptl_press",
            "code": "Common.001",
            "image": svgConstants.pptl,
            "message": "PPTL",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }],
        [{
            "screen_id": "pick_front_no_free_bin",
            "code": "Common.000",
            "image": svgConstants.exception,
            "message": "Wait For MSU",
            "showImage": true,
            "level": null,
            "type": 'active'
        }],
        [{
            "screen_id": ["pick_front_packing_box"],
            "code": "Common.000",
            "image": svgConstants.scan,
            "message": "Scan a packing box and keep in in bin {0}",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "",
            "code": "Common.001",
            "image": svgConstants.pptl,
            "message": "Scan Box",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        },
        {
            "screen_id": "",
            "code": "Common.001",
            "image": svgConstants.pptl,
            "message": "Press PPTL",
            "showImage": true,
            "level": 3,
            "type": 'passive'
        }],
        [
            {
                "screen_id": "",
                "code": "Common.000",
                "image": svgConstants.scan,
                "message": "Scan PB",
                "showImage": true,
                "level": 1,
                "type": 'passive'
            }, {
                "screen_id": ["pick_front_packing_container_scan"],
                "code": "PkF.H.005",
                "image": svgConstants.scan,
                "message": "Scan box from MSU slot",
                "showImage": true,
                "level": 2,
                "type": 'passive'
            }, {
                "screen_id": "",
                "code": "Common.001",
                "image": svgConstants.pptl,
                "message": "Press PPTL",
                "showImage": true,
                "level": 3,
                "type": 'passive'
            }],
        [
            {
                "screen_id": "",
                "code": "Common.000",
                "image": svgConstants.scan,
                "message": "Scan PB",
                "showImage": true,
                "level": 1,
                "type": 'passive'
            }, {
                "screen_id": ["pick_front_packing_item_scan"],
                "code": "Common.001",
                "image": svgConstants.pptl,
                "message": "Scan",
                "showImage": true,
                "level": 2,
                "type": 'passive'
            },
            {
                "screen_id": "",
                "code": "Common.000",
                "image": svgConstants.scan,
                "message": "Press PPTL",
                "showImage": true,
                "level": 3,
                "type": 'passive'
            }],
        [{
            "screen_id": "",
            "code": "Common.000",
            "image": svgConstants.scan,
            "message": "Scan PB",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "",
            "code": "Common.000",
            "image": svgConstants.scan,
            "message": "Scan Box",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }, {
            "screen_id": ["pick_front_packing_pptl_press"],
            "code": "Common.001",
            "image": svgConstants.pptl,
            "message": "Press PPTL to confirm",
            "showImage": true,
            "level": 3,
            "type": 'passive'
        }],
        [{
            "screen_id": ["pick_front_location_confirm"],
            "code": "Common.000",
            "image": svgConstants.scan,
            "message": "Scan Slot Barcode",
            "showImage": true,
            "level": null,
            "type": 'passive'
        }], [{
            "screen_id": ["pick_front_bin_printout", "pick_front_rollcage_print"],
            "code": "PkF.H.016",
            "message": "Take Printout and Press PPTL",
            "showImage": false,
            "level": 1,
            "type": 'passive'
        }], [{
            "screen_id": "pick_front_scan_packs",
            "code": "PkF.H.017",
            "image": svgConstants.scan,
            "message": "Scan {0} packs",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "",
            "code": "TEST.GAURAV.2", //TODO: Would be changed
            "image": svgConstants.pptl,
            "message": "Press PPTL",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }],
        [{
            "screen_id": "pick_front_location_scan",
            "code": "Common.000",
            "image": svgConstants.scan,
            "message": "Scan Slot",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": ["pick_front_working_table", "pick_front_item_scan"],
            "code": "Common.001",
            "image": svgConstants.pptl,
            "message": "Scan Items",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }, {
            "screen_id": "pick_front_pptl_press",
            "code": "Common.001",
            "image": svgConstants.pptl,
            "message": "Press PPTL",
            "showImage": true,
            "level": 3,
            "type": 'passive'
        }], [{
            "screen_id": "pick_front_working_table",
            "code": "Common.001",
            "image": svgConstants.pptl,
            "message": "Scan Items",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "pick_front_pptl_press",
            "code": "Common.001",
            "image": svgConstants.pptl,
            "message": "Press PPTL",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }],
        [{
            "screen_id": "ara_pick_front",
            "code": "Common.000",
            "image": svgConstants.pptl,
            "message": "Operation in progress",
            "showImage": true,
            "type": 'passive'
        }]
    ],
    "pickBack": [
        [{
            "screen_id": "pick_back_scan",
            "code": "Common.001",
            "image": svgConstants.scan,
            "message": "Scan Tote",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "pick_back_bin",
            "code": "Common.000",
            "message": "Remove Item",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }],
        [{
            "screen_id": "pick_back_no_scan",
            "code": "PtF.H.015",
            "message": "Put item into IRT bin and scan the bin",
            "showImage": false,
            "level": 1,
            "type": 'passive'
        }],
        [{
            "screen_id": "pick_back_scan",
            "code": "Common.001",
            "image": svgConstants.scan,
            "message": "Scan Tote",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "pick_back_bin",
            "code": "Common.000",
            "message": "Scan Bin",
            "level": 2,
            "type": 'passive'
        }],
        [{
            "screen_id": ["pick_back_packing_box"],
            "code": "Common.000",
            "image": svgConstants.scan,
            "message": "Place packing box in bin and scan ID",
            "showImage": true,
            "type": 'passive'
        }],
        [{
            "screen_id": "universal_dock_undock",
            "code": "PkB.H.012",
            "image": "",
            "message": "Wait for next action",
            "showImage": false,
            "type": 'active'
        }]

    ],
    "search": [
        [{
            "screen_id": ["waiting_for_msu"],
            "code": "Common.000",
            "message": "Wait For MSU",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [{
            "screen_id": "pick_back_scan",
            "code": "Common.001",
            "image": svgConstants.scan,
            "message": "Scan Slot",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "search_entity_scan",
            "code": "Common.000",
            "message": "Remove Item",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }],
        [{
            "screen_id": "search_irt_confirm",
            "code": "Common.000",
            "message": "Wait For MSU",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }]
    ],
    "audit": [
        [{
            "screen_id": "audit_front_waiting_for_msu",
            "code": "Common.000",
            "message": "Wait For MSU",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [
            {
                "screen_id": "audit_front_waiting_for_location_scan",
                "code": "Common.001",
                "image": svgConstants.scan,
                "message": "Scan MSU Barcode",
                "showImage": true,
                "level": 1,
                "type": 'passive'
            },
            {
                "screen_id": "audit_scan",
                "code": "Common.001",
                "image": svgConstants.scan,
                "message": "Scan Items",
                "showImage": true,
                "level": 2,
                "type": 'passive'
            },
            , {
                "screen_id": "audit_reconcile",
                "code": "Common.000",
                "image": svgConstants.place,
                "message": "Status",
                "showImage": true,
                "level": 3,
                "type": 'passive'
            }]
    ],
    "sraudit": [
        [{
            "screen_id": "audit_front_waiting_for_msu",
            "code": "Common.000",
            "message": "Wait For MPU",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [
            {
                "screen_id": "audit_front_waiting_for_location_scan",
                "code": "Common.001",
                "image": svgConstants.scan,
                "message": "Scan slot",
                "showImage": true,
                "level": 1,
                "type": 'passive'
            },
            {
                "screen_id": "audit_scan_sr",
                "code": "Common.001",
                "image": svgConstants.scan,
                "message": "Scan entities",
                "showImage": true,
                "level": 2,
                "type": 'passive'
            },
            , {
                "screen_id": "audit_reconcile",
                "code": "Common.000",
                "image": null,
                "message": "Status",
                "showImage": true,
                "level": 3,
                "type": 'passive'
            }]
    ],

    "prePut": [
        [{
            "screen_id": "pre_put_stage",
            "code": "Common.000",
            "image": svgConstants.stage,
            "message": "Scan tote",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        },
        {
            "screen_id": "pre_put_scan",
            "code": "Common.001",
            "image": svgConstants.scan,
            "message": "Scan slot",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }],
        [
            {
                "screen_id": "pre_put_release",
                "code": "Common.000",
                "message": "Release MTU",
                "showImage": false,
                "level": 1,
                "type": 'active'
            }]
    ],
    "print": [
        [{
            "screen_id": "per_item_print",
            "code": "Common.000",
            "message": "Paste print out on the item and confirm",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }]
    ],
    "header": []
};

module.exports = navData;
