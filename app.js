(function () {
  "use strict";

  var state = {
    sortKey: "name",
    sortDir: "asc",
    search: "",
    classFilter: "",
  };

  function uniqueClasses(rows) {
    var seen = {};
    var out = [];
    rows.forEach(function (r) {
      if (!seen[r.cls]) {
        seen[r.cls] = true;
        out.push(r.cls);
      }
    });
    out.sort();
    return out;
  }

  function applyFilters(rows) {
    var q = state.search.trim().toLowerCase();
    return rows.filter(function (r) {
      if (state.classFilter && r.cls !== state.classFilter) return false;
      if (q && r.name.toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }

  function applySort(rows) {
    var key = state.sortKey;
    var dir = state.sortDir === "asc" ? 1 : -1;
    var copy = rows.slice();
    copy.sort(function (a, b) {
      var av = a[key];
      var bv = b[key];
      if (typeof av === "string") {
        return av.localeCompare(bv) * dir;
      }
      return (av - bv) * dir;
    });
    return copy;
  }

  function render() {
    var filtered = applyFilters(CHARACTERS);
    var sorted = applySort(filtered);
    var body = document.getElementById("charBody");
    body.innerHTML = "";
    sorted.forEach(function (r) {
      var tr = document.createElement("tr");
      [r.name, r.cls, r.lp, r.str, r.spd, r.mag, r.dex, r.sta].forEach(function (v) {
        var td = document.createElement("td");
        td.textContent = v;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
    document.getElementById("rowCount").textContent =
      sorted.length + " of " + CHARACTERS.length + " characters";

    document.querySelectorAll("thead th").forEach(function (th) {
      if (th.getAttribute("data-key") === state.sortKey) {
        th.setAttribute("data-sort", state.sortDir);
      } else {
        th.removeAttribute("data-sort");
      }
    });
  }

  function init() {
    var classSelect = document.getElementById("classFilter");
    uniqueClasses(CHARACTERS).forEach(function (cls) {
      var opt = document.createElement("option");
      opt.value = cls;
      opt.textContent = cls;
      classSelect.appendChild(opt);
    });

    document.getElementById("search").addEventListener("input", function (e) {
      state.search = e.target.value;
      render();
    });

    classSelect.addEventListener("change", function (e) {
      state.classFilter = e.target.value;
      render();
    });

    document.querySelectorAll("thead th").forEach(function (th) {
      th.addEventListener("click", function () {
        var key = th.getAttribute("data-key");
        if (state.sortKey === key) {
          state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
        } else {
          state.sortKey = key;
          state.sortDir = "asc";
        }
        render();
      });
    });

    var classList = document.getElementById("classList");
    CLASSES.forEach(function (name) {
      var li = document.createElement("li");
      li.textContent = name;
      classList.appendChild(li);
    });

    var formationList = document.getElementById("formationList");
    FORMATIONS.forEach(function (name) {
      var li = document.createElement("li");
      li.textContent = name;
      formationList.appendChild(li);
    });

    render();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { applyFilters: applyFilters, applySort: applySort, state: state };
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
