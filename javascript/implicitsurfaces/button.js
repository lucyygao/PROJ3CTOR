function select() {
    if (document.getElementById('button').innerHTML == "Select") {
        canvas.removeEventListener("pointerdown", clicked);
        canvas.removeEventListener("pointermove", moved);
        canvas.removeEventListener("pointerup", done);
        canvas2.removeEventListener("pointerdown", sculptclicked);
        canvas2.removeEventListener("pointermove", sculptmoved);
        canvas2.removeEventListener("pointerup", sculptdone);

        canvas.addEventListener("pointerdown", selectclicked);
        canvas.addEventListener("pointermove", selectmoved);
        canvas.addEventListener("pointerup", selectdone);
        canvas2.addEventListener("pointerdown", selectsculptclicked);
        canvas2.addEventListener("pointermove", selectsculptmoved);
        canvas2.addEventListener("pointerup", selectsculptdone);
        document.getElementById('button').innerHTML = "Draw";
    }
    else {
        canvas.removeEventListener("pointerdown", selectclicked);
        canvas.removeEventListener("pointermove", selectmoved);
        canvas.removeEventListener("pointerup", selectdone);
        canvas2.removeEventListener("pointerdown", selectsculptclicked);
        canvas2.removeEventListener("pointermove", selectsculptmoved);
        canvas2.removeEventListener("pointerup", selectsculptdone);

        canvas.addEventListener("pointerdown", clicked);
        canvas.addEventListener("pointermove", moved);
        canvas.addEventListener("pointerup", done);
        canvas2.addEventListener("pointerdown", sculptclicked);
        canvas2.addEventListener("pointermove", sculptmoved);
        canvas2.addEventListener("pointerup", sculptdone);
        document.getElementById('button').innerHTML = "Select";
    }
}

document.querySelector("#button").onclick = select;