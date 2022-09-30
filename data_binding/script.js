let obj = {
  append() {
    d3.select("div").append("p").text(" p-text");
  },

  data_driven_append(array) {
    // 데이터를 기반으로 html요소들을 생성
    d3.select("div")
      .selectAll("p") // select('div')에서 p태그 전부 탐색, 결과는 빈 배열
      .data(array) // 데이터 바인딩, 빈 배열에 바인딩했으므로 바인딩되지 않은, 추가할 수 있는 데이터는 array.length개
      .enter() // 추가할 수 있는 데이터 리스트 추출
      .append("p") // p태그에 데이터를 바인딩하여 생성함
      .text((d, i, arr) => ` ${d} Add!`); // 데이터별 text 지정, (data, index, NodeLIst)를 사용할 수 있는 콜백함수 등록 가능
  },

  already_exist_append(iter) {
    // html 요소보다 데이터의 개수가 많으면 그만큼 데이터가 바인딩된 요소를 추가로 생성(요소 변경은 없음)
    // { 요소 < 데이터 개수 } 면 그만큼 추가로 요소를 생성
    d3.select("div")
      .append("input")
      .attr("type", "number")
      .attr("value", 0)
      .on("change", (e) =>{
          this.data_driven_append([...this.numberGenerator(e.target.value)])
        }
      );

    for (let i = 0; i < iter; i++) {
      this.append();
    }
  },

  already_exist_remove(iter) {
    // html 요소가 데이터의 개수보다 많으면 그만큼 요소를 삭제(요소의 추가, 변경은 없음)
    // { 요소 > 데이터 개수} 면 그만큼 요소를 삭제
    for (let i = 0; i < iter; i++) {
      this.append();
    }
    let div = d3.select("div")
      .selectAll("p")
      .data([...this.numberGenerator(iter - 2)]);
    div
      .exit() // 데이터 바인딩이 안된 요소 목록 추출
      .remove(); // 요소 제거
    
    // enter된건 없고, exit된건 4, 5번째 요소
    console.log("data: ", div)
  },

  already_exist_change(iter) {
    // html 요소가 존재할 때 데이터의 개수만큼 요소 변경(추가, 삭제는 없음)
    for (let i = 0; i < iter; i++) {
      this.append();
    }
    d3.select("div")
      .selectAll("p") // p태그 전체 선택
      .data([...this.numberGenerator(3)])
      .text((d) => ` ${d} Change!`); // 해당 요소들의 text변경
  },

  already_exist_append_merge(iter) {
    // 데이터에 맞춰서 변경(추가 가능, 삭제는 없음, merge함수 사용때문에 이전 요소들도 적용됨)
    d3.select("div")
      .append("input")
      .attr("type", "number")
      .attr("value", 0)
      .on("change", (e) => update(e.target.value));

    for (let i = 0; i < iter; i++) {
      this.append();
    }

    let update = (length) => {
      const div = d3
        .select("div")
        .selectAll("p") // p태그 전체 선택
        .data([...this.numberGenerator(length)]);
      div
        .enter()
        .append("p")
        .merge(div) // text, attribute 설정들 직전에 사용, 이전 요소들도 적용하도록 하는 함수
        .text((d) => ` ${d} Change! ${length}`); // 해당 요소들의 text변경
    };
  },

  already_exist_update(iter) {
    const data_join_function = () => {
      d3.select("div")
        .selectAll("p")
        .data([...this.text])
        .join(
          function (enter) {
            console.log({ enter });
            // 데이터가 추가될 경우에는 당연히 추가할 요소가 뭔지(append) 지정해줘야 함
            return enter.append("p").text((d) => d + " add!");
          },
          function (update) {
            console.log({ update });
            return update.text((d) => d + " update!");
          },
          function (exit) {
            console.log({ exit });
            return exit.text((d) => d + " exit!");
          }
        );
    };

    const data_join_auto = () => {
      d3.select("div")
        .selectAll("p")
        .data([...this.text])
        .join("p")
        .text((d) => d + " join!");
    };

    d3.select("div")
      .append("input")
      .on("keyup", (d) => ((this.text = d.target.value), data_join_function()));

    for (let i = 0; i < iter; i++) {
      this.append();
    }
  },

  objectData_update() {
    let update = (click) => {
      let div = d3
        .select("div")
        .selectAll("p")
        .data(genData, (d) => d.value); //  변화감지할 변수 등록, 변화 감지시 해당 변수에 해당하는 요소를 update
      if (click) {
        // 원래 있던 요소들 제거, 이 코드가 없으면 update말고 append가 일어남
        div.exit().remove();
      }
        // 새로 추가된 데이터가 바인딩된 요소들을 생성
      div
        .enter()
        .append("p")
        .text((d) => `id: ${d.id} value: ${d.value}`);

      // 위 코드를 join함수 하나만 사용해서 줄여버릴 수 있음!
      console.log("div:", div);
    };

    d3.select("div")
      .append("button")
      .text("button")
      .on("click", (d) => (
            genData = this.objectGenerator(10),
            console.log(genData),
            update(true)
        )
      );
    let genData = this.objectGenerator(10);
    update(false);
  },

  *numberGenerator(end) {
    for (let i = 1; i <= end; i++) yield i;
  },

  objectGenerator(length) {
    return [...this.numberGenerator(length)].map((d) => ({
      id: d,
      value: (d * Math.random() * 10).toFixed(3),
    }));
  },
};

/* 한 함수씩만 사용 */
// obj.append();
obj.data_driven_append([...obj.numberGenerator(10)]);
// obj.already_exist_append(5);
// obj.already_exist_remove(5);
// obj.already_exist_change(5);
// obj.already_exist_append_merge(5);
// obj.already_exist_update(5);
// obj.objectData_update();