Name | `internal_name` | Description
-----|-----------------|------------
Batting Run Value | `swing_take_run_value` | Every pitch is assigned a run value based on its outcome (ball, strike, home run, etc.). The sum of all of a player's contributions across a season, or multiple seasons, measures his overall batting or pitching run value. A positive value represents runs created for hitters, and runs prevented for pitchers.
Fielding Run Value | `fielding_run_value` | Statcast's overall metric for capturing a player’s measurable defensive performance onto a run-based scale, converting various metrics like OAA, blocking, framing, etc.
Baserunning Run Value | `runner_run_value` | A Statcast metric designed to express the overall value of a baserunner, measured in runs created (or lost) via stealing bases and taking extra bases on the basepaths.
xwOBA | `xwoba` | xwOBA is formulated using exit velocity, launch angle and, on certain types of batted balls, Sprint Speed.
xBA | `xba` | xBA measures the likelihood that a batted ball will become a hit.
Barrels | `barrel` | A batted ball with the perfect combination of exit velocity and launch angle
Barrel % | `barrel_batted_rate` | A batted ball with the perfect combination of exit velocity and launch angle
Avg Exit Velo | `exit_velocity_avg` | On average, how fast, in miles per hour, a ball was hit by a batter.
Max Exit Velo | `exit_velocity_max` | The fastest, in miles per hour, a ball was hit by a batter.
Whiff % | `whiff_percent` | The percent of swings that miss the ball.
Chase % | `chase_percent` | Chase rate is the percentage of out of zone pitches a batter swings at.
Hard-Hit % | `hard_hit_percent` | Statcast defines a 'hard-hit ball' as one hit with an exit velocity of 95 mph or higher.
GB % | `groundballs_percent` | Percentage of BBEs that are a groundball
K % | `k_percent` | Percentage of plate appearances that end in a strikeout.
BB % | `bb_percent` | Percentage of plate appearances that end in a walk (unintentional).
Pitching Run Value | `swing_take_run_value` | Every pitch is assigned a run value based on its outcome (ball, strike, home run, etc.). The sum of all of a player's contributions across a season, or multiple seasons, measures his overall batting or pitching run value. A positive value represents runs created for hitters, and runs prevented for pitchers.
Fastball Run Value | `pitch_run_value_fastball` | Pitching Run Value for fastballs only.
Breaking Run Value | `pitch_run_value_breaking` | Pitching Run Value for breaking balls only.
Offspeed Run Value | `pitch_run_value_offspeed` | Pitching Run Value for offspeed pitches only.
Fastball Velo | `fastball_velo` | Average Fastball Velocity
Fastball Spin | `fastball_spin` | Fastball Spin Rate (Raw RPMs, not effective)
Extension | `fastball_extension` | Pitcher extension on fastballs
Curveball Spin | `cu_spin` | Curveball Spin Rate (Raw RPMs, not effective)
xERA | `xera` | xERA is a simple 1:1 translation of xwOBA, converted to the ERA scale.
Avg Launch Angle | `launch_angle_avg` | Average Launch Angle on BBEs
xSLG | `xslg` | Expected SLG (like xwOBA)
wOBA | `woba` | Weighted On-Base Average (wOBA) is a rate statistic which attempts to credit a hitter for the value of each outcome (single, double, etc) rather than treating all hits or times on base equally. wOBA is on the same scale as On-Base Percentage (OBP) and is a better representation of offensive value than batting average, RBI, or OPS.
xwOBAcon | `xwobacon` | Expected wOBA on BBEs
wOBAcon | `wobacon` | wOBA on BBEs
S.Z. Judge | `sz_judge` | No clue.
BA | `ba` | Batting. Average.
BAcon | `bacon` | Batting Average on Contact
xBAcon | `xbacon` | Expected Batting Average on Contact
BABIP | `babip` | Batting Average on Balls in Play. Often used as a rudimentary "luck" stat.
OBP | `obp` | On-Base Percentage.
SLG | `slg` | Slugging.
xOBP | `xobp` | Expected OBP (like xwOBA)
ISO | `iso` | Extra Bases per At Bat
xISO | `xiso` | Expected Extra Bases per At Bat (like xwOBA)
LA Sweet-Spot % | `sweet_spot_percent` | Percentage of BBEs with a launch angle between 8 and 32 degrees.
Avg. HR Distance | `distance_hr_avg` | Average Home Run Distance
FB % | `airballs_percent` | Percentage of BBEs that are air balls (non-groundballs)
Pulled Flyball % | `pull_percent_airballs` | Percentage of BBEs that are pulled air balls (non-groundballs)
Adj. Avg EV | `avg_hyper_speed` | Average Exit Velocity but each value is floored at 88mph to remove the tail.
EV50 | `avg_best_speed` | Average Exit Velocity on the top 50% of Exit Velocities
xHR | `xhr` | Expected Home Runs
Bat Speed | `swing_speed` | Bat Speed.
Swing Length | `swing_length` | Swing Length
Squared-Up % | `squared_up_swing` | How much exit velocity was obtained compared to the maximum possible exit velocity available, given the speed of the swing and pitch.
Attack Angle | `attack_angle` | The vertical angle at which the sweet spot of the bat is traveling at the point of impact with the ball.
Blast % | `blasts_swing` | A more valuable subset of squared-up balls, defining batted balls that were both squared-up and with a fast swing.
Swing Path Tilt | `vertical_swing_path` | The vertical angle of the arc traced by the swing path over the 40 ms prior to contact. A higher tilt indicates a "steeper" swing, while a lower tilt indicates a "flatter" swing. 
Bat Speed Accel. | `acceleration` | Acceleration Speed of the Bat (no clue)
Ideal Attack Angle % | `ideal_angle_rate` | A ball is hit at an "Ideal Attack Angle," per Statcast, when it is hit with a 5-20° Attack Angle.
Pop Time | `pop_2b` | How quickly, in seconds, a catcher can get the ball out of his glove and to the base on a stolen base or pickoff attempt.
Blocks Above Avg | `blocks_above_average` | A Statcast metric designed to express the demonstrated skill of catchers at preventing wild pitches or passed balls compared to their peers.
Framing | `fielding_run_value_framing` | Catcher framing is the art of a catcher receiving a pitch in a way that makes it more likely for an umpire to call it a strike -- whether that's turning a borderline ball into a strike, or not losing a strike to a "ball" call due to poor framing.
Framing (Unweighted) | `framing` | Does not take into account RE24 matrix
CS Above Avg | `cs_above_average` | Number of Caught Stealings above average
Range (OAA) | `oaa` | A range-based metric of skill that shows how many outs a player has saved over his peers.
Arm Value | `fielding_run_value_arm` | Run Value from the outfielder's arm (such as Outfield Assists)
Arm Strength | `arm_overall` | How hard, in miles per hour, a fielder throws the ball.
Sprint Speed | `sprint_speed` | A measurement of a player's top running speed, expressed in "feet per second in a player's fastest one-second window."
Extra Base Run Value | `runner_runs_xb` | Run Value provided from taking extra bases on hits.
Stolen Base Run Value | `runner_runs_sb` | Run Value provided from Stolen Bases
