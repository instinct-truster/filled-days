/* DOMContentLoaded */
document.addEventListener("DOMContentLoaded", main);

/* main() FUNCTION */

function main() {
  // theme-switcher
  document
    .getElementById("theme-switcher")
    .addEventListener("click", function () {
      document.querySelector("body").classList.toggle("light");
      const themeImg = this.children[0];
      themeImg.setAttribute(
        "src",
        themeImg.getAttribute("src") === "./assets/images/icon-sun.svg"
          ? "./assets/images/icon-moon.svg"
          : "./assets/images/icon-sun.svg"
      );
    });
  // get all goals and initialize listeners
  addGoal();
  // dragover on .goals container
  document.querySelector(".goals").addEventListener("dragover", function (e) {
    e.preventDefault();
    if (
      !e.target.classList.contains("dragging") &&
      e.target.classList.contains("card")
    ) {
      const draggingCard = document.querySelector(".dragging");
      const cards = [...this.querySelectorAll(".card")];
      const currPos = cards.indexOf(draggingCard);
      const newPos = cards.indexOf(e.target);
      console.log(currPos, newPos);
      if (currPos > newPos) {
        this.insertBefore(draggingCard, e.target);
      } else {
        this.insertBefore(draggingCard, e.target.nextSibling);
      }
      const goals = JSON.parse(localStorage.getItem("goals"));
      const removed = goals.splice(currPos, 1);
      goals.splice(newPos, 0, removed[0]);
      localStorage.setItem("goals", JSON.stringify(goals));
    }
  });
  // add new goals on user input
  const add = document.getElementById("add-btn");
  const txtInput = document.querySelector(".txt-input");
  add.addEventListener("click", function () {
    const item = txtInput.value.trim();
    if (item) {
      txtInput.value = "";
      const goals = !localStorage.getItem("goals")
        ? []
        : JSON.parse(localStorage.getItem("goals"));
      const currentGoal = {
        item,
        isCompleted: false,
      };
      addGoal([currentGoal]);
      goals.push(currentGoal);
      localStorage.setItem("goals", JSON.stringify(goals));
    }
    txtInput.focus();
  });
  // add goal also on enter key event
  txtInput.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
      add.click();
    }
  });
  // filter goal - all, active, completed
  document.querySelector(".filter").addEventListener("click", function (e) {
    const id = e.target.id;
    if (id) {
      document.querySelector(".on").classList.remove("on");
      document.getElementById(id).classList.add("on");
      document.querySelector(".goals").className = `goals ${id}`;
    }
  });
  // clear completed
  document
    .getElementById("clear-completed")
    .addEventListener("click", function () {
      deleteIndexes = [];
      document.querySelectorAll(".card.checked").forEach(function (card) {
        deleteIndexes.push(
          [...document.querySelectorAll(".goals .card")].indexOf(card)
        );
        card.classList.add("fall");
        card.addEventListener("animationend", function (e) {
          setTimeout(function () {
            card.remove();
          }, 100);
        });
      });
      removeManyGoal(deleteIndexes);
    });
}

/* stateGoal() FUNCTION TO UPDATE GOAL ABOUT COMPLETION */

function stateGoal(index, completed) {
  const goals = JSON.parse(localStorage.getItem("goals"));
  goals[index].isCompleted = completed;
  localStorage.setItem("goals", JSON.stringify(goals));
}

/* removeManyGoal() FUNCTION TO REMOVE ONE GOAL */

function removeGoal(index) {
  const goals = JSON.parse(localStorage.getItem("goals"));
  goals.splice(index, 1);
  localStorage.setItem("goals", JSON.stringify(goals));
}

/* removeManyGoal FUNCTION TO REMOVE MANY GOALS */

function removeManyGoal(indexes) {
  let goals = JSON.parse(localStorage.getItem("goals"));
  goals = goals.filter(function (goal, index) {
    return !indexes.includes(index);
  });
  localStorage.setItem("goals", JSON.stringify(goals));
}

/* addGoal() FUNCTION TO LIST/CREATE GOALS AND ADD EVENT LISTENERS */

function addGoal(goals = JSON.parse(localStorage.getItem("goals"))) {
  if (!goals) {
    return null;
  }
  const itemsLeft = document.getElementById("items-left");
  // create cards
  goals.forEach(function (goal) {
    const card = document.createElement("li");
    const cbContainer = document.createElement("div");
    const cbInput = document.createElement("input");
    const check = document.createElement("span");
    const item = document.createElement("p");
    const button = document.createElement("button");
    const img = document.createElement("img");
    // Add classes
    card.classList.add("card");
    button.classList.add("clear");
    button.classList.add("button");
    cbContainer.classList.add("cb-container");
    cbInput.classList.add("cb-input");
    item.classList.add("item");
    check.classList.add("check");
    button.classList.add("clear");
    // Set attributes
    card.setAttribute("draggable", true);
    img.setAttribute("src", "./assets/images/icon-cross.svg");
    img.setAttribute("alt", "Clear it");
    cbInput.setAttribute("type", "checkbox");
    // set goal item for card
    item.textContent = goal.item;
    // if completed -> add respective class / attribute
    if (goal.isCompleted) {
      card.classList.add("checked");
      cbInput.setAttribute("checked", "checked");
    }
    // Add drag listener to card
    card.addEventListener("dragstart", function () {
      this.classList.add("dragging");
    });
    card.addEventListener("dragend", function () {
      this.classList.remove("dragging");
    });
    // Add click listener to checkbox
    cbInput.addEventListener("click", function () {
      const correspondingCard = this.parentElement.parentElement;
      const checked = this.checked;
      stateGoal(
        [...document.querySelectorAll(".goals .card")].indexOf(
          correspondingCard
        ),
        checked
      );
      checked
        ? correspondingCard.classList.add("checked")
        : correspondingCard.classList.remove("checked");
      itemsLeft.textContent = document.querySelectorAll(
        ".goals .card:not(.checked)"
      ).length;
    });
    // Add click listener to clear button
    button.addEventListener("click", function () {
      const correspondingCard = this.parentElement;
      correspondingCard.classList.add("fall");
      removeGoal(
        [...document.querySelectorAll(".goals .card")].indexOf(
          correspondingCard
        )
      );
      correspondingCard.addEventListener("animationend", function () {
        setTimeout(function () {
          correspondingCard.remove();
          itemsLeft.textContent = document.querySelectorAll(
            ".goals .card:not(.checked)"
          ).length;
        }, 100);
      });
    });
    // parent.appendChild(child)
    button.appendChild(img);
    cbContainer.appendChild(cbInput);
    cbContainer.appendChild(check);
    card.appendChild(cbContainer);
    card.appendChild(item);
    card.appendChild(button);
    document.querySelector(".goals").appendChild(card);
  });
  // Update itemsLeft
  itemsLeft.textContent = document.querySelectorAll(
    ".goals .card:not(.checked)"
  ).length;
}
