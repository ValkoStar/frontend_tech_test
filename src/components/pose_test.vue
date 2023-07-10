<script setup>
import { ref } from "vue";
import { proto } from "./proto_demo.mjs";

const faces = [
  "face_up",
  "face_down",
  "right",
  "left",
  "vertical_up",
  "vertical_down",
];
const selectedFaces = ref([]);

// Returns the instrument settings based on the given poses
let instrument_settings = (i) => {
  let n = 1;
  let calc = (x) => (n > 0 ? x - 1 : x);

  // Calculate the adjusted poses for faces, sides, and vertical
  let [f, s, v] = [
    calc(i.poses.faces),
    calc(i.poses.sides),
    calc(i.poses.vertical),
  ];

  // Determine the face options, sides, and vertical based on the adjusted poses
  let face_option =
    f > 2 ? [faces[1]] : f > 1 ? [faces[0]] : f > 0 ? [faces[0], faces[1]] : [];

  let sides =
    s > 2 ? [faces[2]] : s > 1 ? [faces[3]] : s > 0 ? [faces[3], faces[2]] : [];
  let vertical =
    v > 2 ? [faces[5]] : v > 1 ? [faces[4]] : v > 0 ? [faces[4], faces[5]] : [];

  // Return the combined instrument settings
  return [...face_option, ...sides, ...vertical];
};

const cubes = ref([]);
const hl = ref([]);
const selectedPoses = ref([]);

// Changes the face of a cube
const chng_face = (i, face) => {
  let c = cubes.value.filter((ii) => ii[0] != i);
  let h = hl.value.filter((ii) => ii[0] != i);
  c.push([i, `show-${face}`]);
  h.push([i, face]);
  cubes.value = c;
  hl.value = h;
  if (!selectedFaces.value[i]) {
    selectedFaces.value[i] = [face];
  } else {
    selectedFaces.value[i] = [...selectedFaces.value[i], face];
  }
};

// Get the current face of a cube
const getCube = (i) => {
  let c = cubes.value.filter((ii) => ii[0] == i);
  return c.length > 0 ? c[0][1] : null;
};

// Checks if a specific face of a cube is highlighted
const getHL = (i, face) => {
  let h = hl.value.filter((ii) => ii[0] == i);
  return h.length > 0 && h[0][1] == face ? true : false;
};

// onChange event handler
const onChange = (event, idx) => {
  chng_face(idx, event.target.value);
  console.log(event.target);
};
</script>

<template>
  <table class="list">
    <th>face</th>
    <th>options</th>
    <th>result</th>
    <tr></tr>
    <template v-for="(item, idx) of proto">
      <tr class="title space">
        <td colspan="3">{{ "|   " }}</td>
      </tr>

      <tr class="title">
        <td colspan="3">{{ item.scalpel_id }}</td>
      </tr>
      <td colspan="3">
        <div>
          <label v-for="face in faces" :key="face">
            <input
              type="checkbox"
              :value="face"
              v-model="selectedPoses"
              checked="true"
            />
            {{ face }}
          </label>
        </div>
      </td>

      <!-- Display all values in the 'properties' object -->
      <tr>
        <td colspan="3">
          <h2>Properties:</h2>
          <div v-for="(value, key) of item.properties" :key="key">
            {{ key }}: {{ value }}
          </div>
          <h2>ID:</h2>
        </td>
      </tr>

      <tr class="v_up">
        <td>{{ idx }}</td>
        <td class="code">poses: {{ item.settings.poses }}</td>
        <td>
          <div v-for="res of selectedFaces[idx]">{{ res }}</div>
        </td>
      </tr>

      <tr>
        <td>
          <div class="scene">
            <div :class="`cube ${getCube(idx)}`">
              <div
                v-for="pose in faces"
                :class="`cube__face cube__face--${pose}${
                  getHL(idx, pose) ? ' highlight' : ''
                }`"
              >
                {{ pose.split("_").join(" ") }}
              </div>
            </div>
          </div>
        </td>

        <td>
          <div style="display: flex; flex-direction: row">
            <div v-for="face in selectedFaces[idx]" class="scene2">
              <div :class="`cube2 show-${face}`">
                <div
                  v-for="pose in faces"
                  :class="`cube2__face cube2__face--${pose}`"
                >
                  {{ pose == face ? String(pose).split("_").join(" ") : null }}
                </div>
              </div>
            </div>
          </div>

          <!-- Display  dropdown menu-->
          <select @change="onChange($event, idx)">
            <option v-for="i in selectedPoses">
              {{ i }}
            </option>
          </select>
        </td>
      </tr>
    </template>
  </table>
</template>

<style scoped lang="sass">

body
  font-size: 12px
  background-color: #242424

button
  margin: 2px

.list
  border-spacing: 0px
  .title
    border-spacing: 0
    font-size: large
  .v_up
    vertical-align: top
    .code
      color: #bebebe
      font-size: small

.space
  background-color: #242424
  color: #242424

.sect
  display: flex
  flex-direction: column
  max-width: 30vw
  min-width: 29vw
  margin: 20px

.sub
  color: #edff79

table
  padding: 0 10px
  text-transform: lowercase
  font-family: monospace

tr:hover
    background: #03c2fc

tr
  background-color: #183666

td
  padding: 10px 0 0 10px

.col
  display: flex
  flex-direction: column
  margin-right: 20px

.active
  background-color: #565ed8
</style>
