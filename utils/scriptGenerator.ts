export interface ScriptOptions {
  vlanEnabled: boolean;
  vlanId: string;
  vlanPriority: string;
  instanceName: string;
}

export const generateUnlockScript = (): string => {
    return `
/* MEGACABLE ZTE SU UNLOCKER & MENU HUNTER v3.0.0 (Deep Scan) */
(function() {
    console.clear();
    console.log("🔓 Unlocking UI...");

    if (!window.jQuery) { 
        alert("Error: jQuery not found on this page."); 
        return; 
    }

    // 1. Force display of everything first (Reveal the hidden menu)
    $("*").css("display", ""); 
    $(".hide").removeClass("hide");
    $("[style*='display:none']").css("display", "");
    $("[style*='display: none']").css("display", "");
    
    // 2. Enable inputs
    $("input, select, textarea, button")
        .prop("disabled", false)
        .prop("readonly", false)
        .removeClass("disableBtn")
        .removeClass("readonlyInputBg");
    $(".PostIgnore").removeClass("PostIgnore");

    // 3. AUTO-NAVIGATOR LOGIC
    var isStatusPage = false;
    var statusTitle = $("h1").text() || "";
    if ($(".statusRow").length > 0 || 
        statusTitle.toLowerCase().indexOf("status") !== -1 ||
        window.location.href.indexOf("status") !== -1 ||
        $("#internetStatus").hasClass("selectClass2Menu")
        ) {
        isStatusPage = true;
    }

    if (isStatusPage) {
        console.log("Status page detected. Initiating Menu Hunter (Deep Scan)...");
        
        // --- DEEP SCAN MENU HUNTER ---
        var candidates = [
             "wan_internet_lua.lua",
             "ethWanConfig",
             "wan_internet",
             "wan_conn_edit_lua.lua",
             "wan_configure_lua.lua",
             "wan_ip_lua.lua",
             "wan_ptm_lua.lua",
             "wan_dsl_lua.lua",
             "wan_eth_lua.lua",
             "wan_syn_lua.lua",
             "internet_wan_lua.lua",
             "ipv4_wan_lua.lua",
             "ipv6_wan_lua.lua",
             "wan_server_lua.lua",
             "wan_config_t.lp",
             "wan_common_lua.lua"
        ];
        
        var currentSearch = window.location.search;
        var match = currentSearch.match(/_tag=([^&]+)/);
        if (match && match[1]) {
            var currentTag = match[1];
            var derived = currentTag.replace("status", "").replace("Status", "");
            if (derived !== currentTag) {
                candidates.unshift(derived);
            }
        }
        
        candidates = candidates.filter(function(item, pos) { return candidates.indexOf(item) == pos; });

        function probe(index) {
            if (index >= candidates.length) {
                alert("❌ Menu Hunter failed.\\n\\nAll " + candidates.length + " paths returned 404.\\n\\nIt is highly likely your user account is blocked from viewing the config page.\\n\\nTRY THE 'BLIND INJECTION' MODE IN THE TOOL.");
                return;
            }

            var tag = candidates[index];
            var checkUrl = "/?_type=menuView&_tag=" + tag;
            
            console.log("Probing [" + (index+1) + "/" + candidates.length + "]: " + tag);

            $.ajax({
                url: checkUrl,
                type: 'GET',
                global: false,
                success: function(data) {
                    if (data && data.indexOf("Page request failed") === -1 && data.indexOf("Error 404") === -1 && data.length > 500) {
                        console.log("SUCCESS! Found valid page: " + tag);
                        if (confirm("✅ FOUND IT!\\n\\nHidden configuration page detected at:\\n" + tag + "\\n\\nClick OK to go there now.")) {
                            window.location.href = checkUrl;
                        }
                    } else {
                        probe(index + 1);
                    }
                },
                error: function() {
                    probe(index + 1);
                }
            });
        }

        if (confirm("⚠️ You are on the STATUS page.\\n\\nI will now run the 'Deep Scan' Menu Hunter to find the hidden config page.\\n\\nClick OK to start.")) {
            probe(0);
        }
        return; 
    }

    // 4. Config Page Logic (if successful)
    try {
        if (typeof wanConf !== 'undefined') {
            wanConf.requiredF = "0,0,0,0"; 
            wanConf.elementControl = undefined; 
            wanConf.readyCtrl = undefined; 
        }
    } catch(e) {}

    $("[id^='mode']").each(function() {
        if ($(this).find("option[value='bridge']").length === 0) {
            $(this).append('<option value="bridge">Bridge Connection</option>');
        }
    });
    
    $(".collapsibleInst").each(function() {
        var $t = $(this);
        var $area = $t.closest("[id^='template_']").find(".ChangeArea");
        if($area.is(":hidden")) $t.click();
    });

    console.log("UI Unlock Complete.");
    if (!isStatusPage) {
        alert("🔓 UI Unlocked (Config Mode).\\n\\nMenus revealed and fields enabled.");
    }
})();
    `;
}

export const generateBridgeScript = (options: ScriptOptions): string => {
  const { vlanEnabled, vlanId, vlanPriority, instanceName } = options;

  return `
/* MEGACABLE ZTE BRIDGE CONFIGURATOR v3.0.0 */
(function() {
    console.clear();
    console.log("🔧 Configuring Form for Bridge Mode...");

    if (!window.jQuery) { 
        alert("Error: jQuery not found. Are you on the right page?"); 
        return; 
    }

    // Helper to safely set values
    function set(selector, val) {
        var $el = $(selector);
        if ($el.length > 0) {
            $el.val(val).trigger('change');
        }
    }
    
    // Helper to check checkboxes
    function check(selector, checked) {
        var $el = $(selector);
        if ($el.length > 0) {
            $el.prop('checked', checked).trigger('change');
        }
    }

    // 1. Connection Name & Mode
    set("[id*='WANCName']", "${instanceName}"); // Name
    set("input[name='WANCName']", "${instanceName}");
    
    // Try to set mode to Bridge. 
    // Note: Some firmwares use 'WanMode', others 'mode'.
    // The unlock script forces the 'bridge' option to exist if it was hidden.
    set("[id*='WanMode']", "Bridge");
    set("select[name='WanMode']", "Bridge");
    set("[id*='mode']", "bridge"); 
    set("select[name='mode']", "bridge");

    // 2. Service List
    set("[id*='ServiceList']", "INTERNET");
    
    // 3. IP Protocol
    set("[id*='IpMode']", "IPv4"); // Usually safer to default to IPv4
    
    // 4. VLAN Settings
    if (${vlanEnabled}) {
        console.log("Enabling VLAN ${vlanId}...");
        set("select[name='VlanEnable']", "1");
        set("[id*='VlanEnable']", "1");
        
        // Short delay to ensure UI updates if needed (though usually instant with jQuery)
        setTimeout(function() {
             set("input[name='VLANID']", "${vlanId}");
             set("[id*='VLANID']", "${vlanId}");
             
             set("select[name='Priority']", "${vlanPriority}");
             set("[id*='Priority']", "${vlanPriority}");
             set("select[name='VlanPri']", "${vlanPriority}"); // Some models use this
        }, 100);
    } else {
        console.log("Disabling VLAN...");
        set("select[name='VlanEnable']", "0");
        set("[id*='VlanEnable']", "0");
    }

    // 5. Port Binding (LAN1-LAN4)
    // We try to bind all ports to this bridge
    check("[id*='LandBind']", true);
    check("input[name^='LandBind']", true);

    alert("✅ Settings Applied!\\n\\n1. Verify 'Connection Name' is '${instanceName}'.\\n2. Verify 'Mode' is 'Bridge'.\\n3. Verify VLAN is ${vlanEnabled ? vlanId : 'OFF'}.\\n\\nClick 'Create' or 'Apply' to save.");
})();
`;
};

export const generateBlindBridgeScript = (options: ScriptOptions): string => {
  const { vlanEnabled, vlanId, vlanPriority, instanceName } = options;

  return `
/* MEGACABLE ZTE BLIND PROTOCOL DROID v3.4.0 */
/* Run this directly on the STATUS page */
(function() {
    console.clear();
    console.log("🤖 PROTOCOL DROID ACTIVATED (v3.4.0)...");
    console.log("Target: Bridge Mode [${instanceName}]");

    if (!window.jQuery) {
        alert("Error: jQuery not found.");
        return;
    }

    // 1. Get Session Token
    var token = "";
    if (typeof _sessionTmpToken !== "undefined") {
        token = _sessionTmpToken;
    } else if ($("#_sessionTOKEN").length > 0) {
        token = $("#_sessionTOKEN").val();
    } else {
        alert("❌ Error: Could not find Session Token.\\n\\nMake sure you are logged in.");
        return;
    }
    
    console.log("Token: " + token.substring(0, 5) + "...");

    // 2. Define The Matrix
    // Expanded list of potential endpoints
    var files = [
        "wan_internet_lua.lua",
        "ethWanConfig",
        "wan_conn_edit_lua.lua",
        "wan_common_lua.lua",
        "ipv4_wan_lua.lua",
        "wan_configure_lua.lua",
        "wan_config_t.lp"
    ];

    var types = [
        "addData",      // Best guess for creation
        "configData",   // Common alternate
        "submit",       // Rare
        "update",       // Rare
        "set",          // New v3.4: Common ZTE write endpoint
        "create",       // New v3.4
        "add",          // New v3.4
        "t_insert"      // New v3.4: Table insert
    ];
    // REMOVED: "menuData" - It often returns 200 OK (menu JSON) without saving, causing False Positives.

    var combinations = [];
    for (var i = 0; i < files.length; i++) {
        for (var j = 0; j < types.length; j++) {
            combinations.push({ file: files[i], type: types[j] });
        }
    }

    // 3. Payload Construction
    var basePayload = {
        "IF_ACTION": "Apply",
        "_InstID": "-1",
        "_sessionTOKEN": token,
        "WANCName": "${instanceName}",
        "WanMode": "Bridge",
        "mode": "bridge",
        "TransType": "Bridge",
        "RouteMode": "Bridge",
        "ConnectionType": "IP_Bridged",
        "LinkMode": "IP",
        "ServiceList": "INTERNET",
        "OrgServiceList": "INTERNET",
        "MTU": "1500",
        "IpMode": "IPv4",
        "IsNAT": "0", 
        "Enable": "1",
        "Status": "1",
        "AdminState": "1",
        "VlanEnable": "${vlanEnabled ? '1' : '0'}",
        "VLANID": "${vlanId}",
        "Priority": "${vlanPriority}",
        "VlanPri": "${vlanPriority}",
        "vlanId": "${vlanId}",
        "LandBind1": "1", "LandBind2": "1", "LandBind3": "1", "LandBind4": "1",
        "LandBind": "LAN1,LAN2,LAN3,LAN4",
        "SsidBind1": "1", "SsidBind2": "1", "SsidBind3": "1", "SsidBind4": "1"
    };

    if (!confirm("⚠️ PROTOCOL DROID READY\\n\\nI will now attempt " + combinations.length + " injection vectors.\\n\\nNote: I have removed 'menuData' from this version to avoid false positives.\\n\\nTarget: ${instanceName} (VLAN ${vlanId})\\n\\nClick OK to engage.")) {
        return;
    }

    // 4. Recursive Injector
    function inject(index) {
        if (index >= combinations.length) {
            alert("❌ Protocol Droid Failed.\\n\\nExhausted all " + combinations.length + " vectors.\\n\\nBecause you are getting 404 errors, your current user account (" + (typeof username !== 'undefined' ? username : 'unknown') + ") is BLOCKED from these pages.\\n\\nSOLUTION:\\nYou must use the 'MAC Spoofing Method' (see Resources tab).\\nIt DOES NOT require a login.");
            return;
        }

        var combo = combinations[index];
        var targetUrl = "/?_type=" + combo.type + "&_tag=" + combo.file + "&_sessionTOKEN=" + encodeURIComponent(token);
        
        console.log("Vector [" + (index+1) + "/" + combinations.length + "]: " + combo.file + " (" + combo.type + ")");

        // METHOD A: FormData (Multipart)
        var fd = new FormData();
        for (var k in basePayload) {
            fd.append(k, basePayload[k]);
        }

        $.ajax({
            type: "POST",
            url: targetUrl,
            data: fd,
            processData: false,  // Important for FormData
            contentType: false,  // Important for FormData
            timeout: 5000,
            success: function(response) {
                checkResponse(response, combo, index);
            },
            error: function() {
                // METHOD B: Fallback to URL Encoded if Multipart fails (400/500)
                tryUrlEncoded(targetUrl, combo, index);
            }
        });
    }

    function tryUrlEncoded(url, combo, index) {
        var str = "";
        for (var key in basePayload) {
            if (str !== "") str += "&";
            str += encodeURIComponent(key) + "=" + encodeURIComponent(basePayload[key]);
        }

        $.ajax({
            type: "POST",
            url: url,
            data: str,
            contentType: "application/x-www-form-urlencoded",
            processData: false, // Prevent jQuery from reprocessing
            timeout: 5000,
            success: function(response) {
                checkResponse(response, combo, index);
            },
            error: function(xhr) {
                console.log("  -> Failed (" + xhr.status + ")");
                inject(index + 1);
            }
        });
    }

    function checkResponse(response, combo, index) {
        var respStr = "";
        try {
            if (typeof response === "string") {
                respStr = response;
            } else if (typeof response === "object") {
                respStr = JSON.stringify(response);
            } else {
                respStr = String(response);
            }
        } catch (e) {
            respStr = "";
        }
        
        var isError = false;
        if (!respStr) isError = true;
        
        // Common ZTE Error Flags
        if (respStr.indexOf("externErrorHint") !== -1 && respStr.indexOf("display:none") === -1) isError = true;
        if (respStr.indexOf("Page request failed") !== -1) isError = true;
        if (respStr.indexOf("Error 404") !== -1) isError = true;
        
        // Strict JSON Checking
        if (typeof response === "object" && response !== null) {
             if (response.result === "error") isError = true;
             // If the response is valid JSON but empty or weird, we might be cautious
             // but for now, if it's not an explicit error, we assume success.
        }

        if (!isError) {
             console.log("✅ SUCCESS RESPONSE:", response);
             alert("✅ PROTOCOL DROID SUCCESS!\\n\\nVector Match: " + combo.file + " (" + combo.type + ")\\n\\nThe modem accepted the payload.\\n\\nReloading page...");
             window.location.reload();
        } else {
             inject(index + 1);
        }
    }

    // Engage
    inject(0);

})();
`;
};