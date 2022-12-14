const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select("#my_project")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// 데이터 불러오기
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv").then( function(data) {

// X축 추가
const x = d3.scaleBand() // 문자열이므로 scaleLinear 대신 scaleBand 사용
    .range([ 0, width ])
    .domain(data.map(d => d.Country))
    .padding(0.2);

svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");


// Y축 추가
const y = d3.scaleLinear()
  .domain([0, 13000])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
  .data(data)
  .join("rect")
  .attr("x", d => x(d.Country))
  .attr("y", d => y(d.Value))
  .attr("width", x.bandwidth())
  .attr("height", d => height - y(d.Value))
  .attr("fill", "#69b3a2")
  .on("mouseover", mouseover)
  .on("mouseleave", mouseleave)

})

// let mouseover = function(d) {
//     d3.select(this)
//       .style("fill", "black");
// }

