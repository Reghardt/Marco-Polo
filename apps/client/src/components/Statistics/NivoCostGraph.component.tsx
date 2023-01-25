import { ResponsiveBar } from '@nivo/bar'

const demoData = [
    {
      "country": "AD",
      "hot dog": 166,
      "hot dogColor": "hsl(216, 70%, 50%)",
      "burger": 118,
      "burgerColor": "hsl(160, 70%, 50%)",
      "sandwich": 30,
      "sandwichColor": "hsl(68, 70%, 50%)",
      "kebab": 73,
      "kebabColor": "hsl(280, 70%, 50%)",
      "fries": 150,
      "friesColor": "hsl(47, 70%, 50%)",
      "donut": 67,
      "donutColor": "hsl(0, 70.19607843137256%, 50%)"
    },
    {
      "country": "AE",
      "hot dog": 171,
      "hot dogColor": "hsl(327, 70%, 50%)",
      "burger": 62,
      "burgerColor": "hsl(284, 70%, 50%)",
      "sandwich": 16,
      "sandwichColor": "hsl(245, 70%, 50%)",
      "kebab": 47,
      "kebabColor": "hsl(340, 70%, 50%)",
      "fries": 29,
      "friesColor": "hsl(34, 70%, 50%)",
      "donut": 124,
      "donutColor": "hsl(106, 70%, 50%)"
    },
    
  ]

const NivoCostGraph: React.FC = () => {
    console.log("nivo graph fired")
    return(
        <div className={"h-80"}>

        
            <ResponsiveBar
                
                data={demoData}
                keys={[
                    'hot dog',
                    'burger',
                    'sandwich',
                    'kebab',
                    'fries',
                    'donut'
                ]}
                indexBy="country"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            maxValue={"auto"}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={["#0004fd", "#ff0000"]}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'leg',
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'cost',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
            />
        </div>
    )
}

export default NivoCostGraph