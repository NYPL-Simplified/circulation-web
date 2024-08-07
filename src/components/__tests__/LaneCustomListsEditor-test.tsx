import { expect } from "chai";
import { stub } from "sinon";

import React from "react";
import { mount } from "enzyme";

import { Droppable, Draggable } from "react-beautiful-dnd";
import LaneCustomListsEditor from "../LaneCustomListsEditor";

describe("LaneCustomListsEditor", () => {
  let wrapper;
  let onUpdate;

  const allCustomListsData = [
    { id: 1, name: "list 1", entry_count: 0 },
    { id: 2, name: "list 2", entry_count: 2 },
    { id: 3, name: "list 3", entry_count: 0 },
  ];

  beforeEach(() => {
    onUpdate = stub();
  });

  it("renders available lists", () => {
    let wrapper = mount(
      <LaneCustomListsEditor
        allCustomLists={allCustomListsData}
        customListIds={[]}
      />
    );
    let container = wrapper.find("div.available-lists");
    expect(container.length).to.equal(1);

    let droppable = container.find("div.droppable");
    expect(droppable.length).to.equal(1);

    let lists = droppable.find("div.available-list");
    expect(lists.length).to.equal(3);

    expect(lists.at(0).text()).to.contain("list 1");
    expect(lists.at(0).text()).to.contain("Items in list: 0");
    expect(lists.at(1).text()).to.contain("list 2");
    expect(lists.at(1).text()).to.contain("Items in list: 2");
    expect(lists.at(2).text()).to.contain("list 3");
    expect(lists.at(2).text()).to.contain("Items in list: 0");

    wrapper = mount(
      <LaneCustomListsEditor
        allCustomLists={allCustomListsData}
        customListIds={[1, 3]}
      />
    );

    container = wrapper.find(".available-lists");
    expect(container.length).to.equal(1);

    droppable = container.find("div.droppable");
    expect(droppable.length).to.equal(1);

    lists = droppable.find("div.available-list");
    expect(lists.length).to.equal(1);

    expect(lists.at(0).text()).to.contain("list 2");
    expect(lists.at(0).text()).to.contain("Items in list: 2");
  });

  it("renders current lists", () => {
    let wrapper = mount(
      <LaneCustomListsEditor
        allCustomLists={allCustomListsData}
        customListIds={[]}
      />
    );
    let container = wrapper.find(".current-lists");
    expect(container.length).to.equal(1);

    let droppable = container.find("div.droppable");
    expect(droppable.length).to.equal(1);

    let lists = droppable.find("div.available-list");
    expect(lists.length).to.equal(0);

    wrapper = mount(
      <LaneCustomListsEditor
        allCustomLists={allCustomListsData}
        customListIds={[2, 3]}
      />
    );

    container = wrapper.find(".current-lists");
    expect(container.length).to.equal(1);

    droppable = container.find("div.droppable");
    expect(droppable.length).to.equal(1);

    lists = droppable.find(".current-list");
    expect(lists.length).to.equal(2);

    expect(lists.at(0).text()).to.contain("list 2");
    expect(lists.at(0).text()).to.contain("Items in list: 2");
    expect(lists.at(1).text()).to.contain("list 3");
    expect(lists.at(1).text()).to.contain("Items in list: 0");
  });

  it("drags from available lists to current lists", () => {
    const wrapper = mount(
      <LaneCustomListsEditor
        allCustomLists={allCustomListsData}
        customListIds={[1]}
        onUpdate={onUpdate}
      />
    );

    let currentContainer = wrapper.find(".current-lists");
    let droppable = currentContainer.find(".droppable");
    let lists = droppable.find(".current-list");

    expect(lists.length).to.equal(1);
    expect(lists.at(0).text()).to.contain("list 1");

    // simulate dropping a book on the current lists
    wrapper.instance().onDragEnd({
      draggableId: 2,
      source: {
        droppableId: "available-lists",
      },
      destination: {
        droppableId: "current-lists",
      },
    });

    expect(onUpdate.callCount).to.equal(1);
    expect(onUpdate.args[0][0]).to.deep.equal([1, 2]);

    wrapper.setProps();
    wrapper.update();

    expect(wrapper.props().customListIds).to.deep.equal([1, 2]);

    currentContainer = wrapper.find(".current-lists");
    droppable = currentContainer.find(".droppable");
    lists = droppable.find(".current-list");

    expect(lists.length).to.equal(2);
    expect(lists.at(0).text()).to.contain("list 1");
    expect(lists.at(1).text()).to.contain("list 2");
  });

  it("drags from current lists to available lists", () => {
    const wrapper = mount(
      <LaneCustomListsEditor
        allCustomLists={allCustomListsData}
        customListIds={[1, 2]}
        onUpdate={onUpdate}
      />
    );

    // simulate starting a drag from current lists
    (wrapper.instance() as LaneCustomListsEditor).onDragStart();
    wrapper.update();

    const availableContainer = wrapper.find(".available-lists");
    let droppable = availableContainer.find(".droppable");
    // simulate dropping on the available lists
    (wrapper.instance() as LaneCustomListsEditor).onDragEnd({
      draggableId: 1,
      source: {
        droppableId: "current-lists",
      },
      destination: {
        droppableId: "available-lists",
      },
    });
    wrapper.update();
    wrapper.setProps({ customListIds: onUpdate.args[0][0] });

    // the dropped item has been removed from the current lists
    const currentContainer = wrapper.find(".current-lists");
    droppable = currentContainer.find(".droppable");
    const lists = droppable.find(".current-list");

    expect(lists.length).to.equal(1);
    expect(lists.at(0).text()).to.contain("list 2");
    expect(onUpdate.callCount).to.equal(1);
    expect(onUpdate.args[0][0]).to.deep.equal([2]);
  });

  it("adds a list to the lane", () => {
    const wrapper = mount(
      <LaneCustomListsEditor
        allCustomLists={allCustomListsData}
        customListIds={[2]}
        onUpdate={onUpdate}
      />
    );

    const addLink = wrapper.find(".available-lists .links button");
    addLink.at(0).simulate("click");

    wrapper.setProps();
    wrapper.update();

    // the item has been added to the current lists
    const currentContainer = wrapper.find(".current-lists");
    const droppable = currentContainer.find(".droppable");
    const lists = droppable.find(".current-list");
    expect(lists.length).to.equal(2);
    expect(lists.at(0).text()).to.contain("list 1");
    expect(onUpdate.callCount).to.equal(1);
    expect(onUpdate.args[0][0]).to.contain(1);
    expect(onUpdate.args[0][0]).to.contain(2);
  });

  it("removes a list from the lane", () => {
    const wrapper = mount(
      <LaneCustomListsEditor
        allCustomLists={allCustomListsData}
        customListIds={[1, 2]}
        onUpdate={onUpdate}
      />
    );

    const deleteLink = wrapper.find(".current-lists .links button");
    deleteLink.at(0).simulate("click");
    wrapper.setProps({ customListIds: onUpdate.args[0][0] });
    // this list has been removed from the current lists
    const currentContainer = wrapper.find(".current-lists");
    const droppable = currentContainer.find(".droppable");
    const lists = droppable.find(".current-list");
    expect(lists.length).to.equal(1);
    expect(lists.at(0).text()).to.contain("list 2");
    expect(onUpdate.callCount).to.equal(1);
    expect(onUpdate.args[0][0]).to.deep.equal([2]);
  });

  it("resets", () => {
    const wrapper = mount(
      <LaneCustomListsEditor
        allCustomLists={allCustomListsData}
        customListIds={[1]}
        onUpdate={onUpdate}
      />
    );

    // simulate dropping a list on the current lists
    (wrapper.instance() as LaneCustomListsEditor).onDragEnd({
      draggableId: 2,
      source: {
        droppableId: "available-lists",
      },
      destination: {
        droppableId: "current-lists",
      },
    });

    // Set customListIds to the new array of list IDs for this lane ([1, 2]), which got passed to
    // onUpdate when we added list 2 to the current lists
    wrapper.setProps({ customListIds: onUpdate.args[0][0] });
    expect(
      (wrapper.instance() as LaneCustomListsEditor).getCustomListIds().length
    ).to.equal(2);
    expect(onUpdate.callCount).to.equal(1);
    (wrapper.instance() as LaneCustomListsEditor).reset([1]);
    // Calling reset passes the original array of list IDs ([1]) to onUpdate
    wrapper.setProps({ customListIds: onUpdate.args[1][0] });
    expect(
      (wrapper.instance() as LaneCustomListsEditor).getCustomListIds().length
    ).to.equal(1);
    expect(onUpdate.callCount).to.equal(2);

    // simulate dropping a list on the available lists
    (wrapper.instance() as LaneCustomListsEditor).onDragEnd({
      draggableId: 1,
      source: {
        droppableId: "current-lists",
      },
      destination: {
        droppableId: "available-lists",
      },
    });

    // Set customListIds to the new array of list IDs for this lane ([]), which got passed to
    // onUpdate when we removed list 1 from the current lists
    wrapper.setProps({ customListIds: onUpdate.args[2][0] });
    expect(
      (wrapper.instance() as LaneCustomListsEditor).getCustomListIds().length
    ).to.equal(0);
    expect(onUpdate.callCount).to.equal(3);
    (wrapper.instance() as LaneCustomListsEditor).reset([1]);
    // Calling reset passes the original array of list IDs ([1]) to onUpdate
    wrapper.setProps({ customListIds: onUpdate.args[3][0] });
    expect(
      (wrapper.instance() as LaneCustomListsEditor).getCustomListIds().length
    ).to.equal(1);
    expect(onUpdate.callCount).to.equal(4);
  });
});
